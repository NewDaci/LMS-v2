# from celery import Celery
# from celery.schedules import crontab
from celery import Celery, Task

# celery = Celery('Celery Jobs with redis broker and backend_result ',
#                  broker='redis://localhost:6379/1',
#                  backend='redis://localhost:6379/2',
#                  broker_connection_retry_on_startup=True,
#                  timezone='Asia/Kolkata',
#                 )


# @celery.on_after_finalize.connect
# def at_6pm(sender, **kwargs):
#     # sender.add_periodic_task(10.0, call_every_day.s("nice"), name="At every 10seconds")
#     sender.add_periodic_task( crontab(hour=22, minute=45),call_every_day.s('Happy Mondays!'),)



# @celery.task()
# def call_every_day(name):
#     print("inside tasks", name)


def celery_init_app(app):
    class FlaskTask(Task):
        def __call__(self, *args: object, **kwargs: object) -> object:
            with app.app_context():
                return self.run(*args, **kwargs)

    celery_app = Celery(app.name, task_cls=FlaskTask)
    celery_app.config_from_object("celery_config")
    return celery_app

