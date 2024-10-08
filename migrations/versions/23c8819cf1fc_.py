"""empty message

Revision ID: 23c8819cf1fc
Revises: e36e289a5b19
Create Date: 2024-07-22 22:29:16.421414

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '23c8819cf1fc'
down_revision = 'e36e289a5b19'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('user', schema=None) as batch_op:
        batch_op.alter_column('role',
               existing_type=sa.VARCHAR(),
               nullable=False)

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('user', schema=None) as batch_op:
        batch_op.alter_column('role',
               existing_type=sa.VARCHAR(),
               nullable=True)

    # ### end Alembic commands ###
