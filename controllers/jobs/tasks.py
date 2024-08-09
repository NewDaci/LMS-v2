from celery import shared_task
from app import db,celery
from models.model import Enrollments, User, Rating, Sections, Book, Feedback
from datetime import datetime, timedelta, date
from .mail import send_message
from jinja2 import Template
from sqlalchemy import or_
from sqlalchemy import and_
import flask_excel as excel
import csv

# Check if a user has a return date approaching
# send daily reminders to users via mail
@shared_task(ignore_result=True)
def return_date_approach():

    today = datetime.now()
    reminder_date = today + timedelta(days=2)
    enrolls = Enrollments.query.filter(Enrollments.return_date <= reminder_date, Enrollments.return_date > today).all()

    for enroll in enrolls:
        with open('templates/book_return.html', 'r') as f:
            template = Template(f.read())

        send_message(
            enroll.user.email,
            "City Library | Reminder - Return Book",
            template.render(enroll=enroll)
        )

    print("Sent Return Book Reminder Successfully!")


# Check if a user has visited site today or not
# send daily reminders to users via mail to visit the site
@shared_task(ignore_result=True)
def daily_reminder():

    today = date.today()
    users = User.query.filter(or_(User.last_visit_date != today, User.last_visit_date == None)).all()

    for user in users:
        with open('templates/daily_reminder.html', 'r') as f:
            template = Template(f.read())

        send_message(
                user.email,
                "City Library | Reminder - Daily Visits",
                template.render(user=user)
            )

    print("Sent Daily Reminder to unvisited users Successfully!")



@shared_task(ignore_result=True)
def monthly_report():

    # Define the date range for the past month
    today = date.today()
    one_month_back_date = today - timedelta(days=30)

    books = Book.query.filter(Book.date_added >= one_month_back_date).all()

    enrolls = Enrollments.query.filter(Enrollments.issue_date >= one_month_back_date).all()  #chart

    sections = Sections.query.filter(Sections.date_created >= one_month_back_date).all()

    feedbacks = [ (book.name, Feedback.query.filter_by(book_id=book.id).all()) for book in books if Feedback.query.filter_by(book_id=book.id).first()]    


    # Read and render the template
    with open('templates/monthly_report.html', 'r') as f:
        template = Template(f.read())

    html_content = template.render(
        today = today,
        data_till = one_month_back_date,
        books = books,
        sections = sections,
        feedbacks = feedbacks,
        enrolls=enrolls,
    )

    # Send the report via email
    send_message(
       "admin@citylibrary.in",
        "City Library Admin | Monthly Reports",
        html_content
    )

    print("Sent Monthly Report successfully!")


@celery.task
def user_report(id):

    user = User.query.filter_by(id=id).first()

    csv_data = []
    for enroll in user.enrollments:
        csv_data.append({
            'ISBN No.': enroll.book.isbn,
            'Book Name': enroll.book.name,
            "Author's Name": enroll.book.author_name,
            'Section': enroll.book.sections.name,
            'Language': enroll.book.language,
            'Rating': enroll.book.rating,
            'Issued On': enroll.issue_date,
            'Return Date': enroll.return_date
            
        })

    filename="user_report.csv"

    with open(filename, 'w', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=['ISBN No.', 'Book Name', "Author's Name",'Section', 'Language', 'Rating', 'Issued On', 'Return Date'])
        writer.writeheader()
        writer.writerows(csv_data)

    return filename


@celery.task
def admin_book_report():

    books = Book.query.all()

    csv_data = []
    for book in books:
        csv_data.append({
            'ISBN No.': book.isbn,
            'Book Name': book.name,
            "Author's Name": book.author_name,
            'Section': book.sections.name,
            'Language': book.language,
            'Added On': book.date_added,
            'Book Content': book.content,
            'Rating': book.rating,
            'No. Users currently having this book': len(book.enrollments),
            
        })

    # csv_data = excel.make_response_from_query_sets(books, ["name","content"], "csv") 
    filename="book_report.csv"
    # with open(filename, 'wb') as f:
    #     f.write(csv_data.data)
    with open(filename, 'w', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=['ISBN No.', 'Book Name', "Author's Name",'Section', 'Language', 'Added On', 'Book Content', 'Rating', 'No. Users currently having this book'])
        writer.writeheader()
        writer.writerows(csv_data)

    return filename



@celery.task
def admin_issue_report():

    enrollments = db.session.query(Enrollments).join(User).join(Book).all()
    
    csv_data = []
    for enroll in enrollments:
        csv_data.append({
            'User Name': enroll.user.name,
            'Book Name': enroll.book.name,
            'Issue Date': enroll.issue_date,
            'Return Date': enroll.return_date
        })

    filename = "issue_report.csv"
    with open(filename, 'w', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=['User Name', 'Book Name', 'Issue Date', 'Return Date'])
        writer.writeheader()
        writer.writerows(csv_data)

    return filename



                                        ##### using flask excel ######
# @celery.task
# def admin_issue_report():

#     enrollments = db.session.query(Enrollments).join(User).join(Book).all()
    
#     csv_data = []
#     for enroll in enrollments:
#         csv_data.append({
#             'User Name': enroll.user.name,
#             'Book Name': enroll.book.name,
#             'Issue Date': enroll.issue_date,
#             'Return Date': enroll.return_date
#         })

#     column_order = ['User Name', 'Book Name', 'Issue Date', 'Return Date']
#     csv_response = excel.make_response_from_records(csv_data, "csv", column_order=column_order)

    
#     filename = "issue_report.csv"
#     with open(filename, 'wb') as f:
#         f.write(csv_response.data)

#     return filename


