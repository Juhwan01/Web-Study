"""empty message

Revision ID: 2d1ac128198b
Revises: 2f34174e1845
Create Date: 2024-11-20 02:20:08.368602

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '2d1ac128198b'
down_revision: Union[str, None] = '2f34174e1845'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('users',
    sa.Column('user_no', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('user_name', sa.VARCHAR(length=10), nullable=False),
    sa.Column('email', sa.VARCHAR(length=100), nullable=False),
    sa.Column('hashed_pw', sa.VARCHAR(length=100), nullable=False),
    sa.Column('role', sa.VARCHAR(length=20), nullable=False),
    sa.Column('status', sa.VARCHAR(length=1), nullable=False),
    sa.Column('regdate', sa.DateTime(), nullable=False),
    sa.PrimaryKeyConstraint('user_no')
    )
    op.drop_table('user')
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('user',
    sa.Column('user_no', sa.INTEGER(), autoincrement=True, nullable=False),
    sa.Column('user_name', sa.VARCHAR(length=10), autoincrement=False, nullable=False),
    sa.Column('email', sa.VARCHAR(length=100), autoincrement=False, nullable=False),
    sa.Column('hashed_pw', sa.VARCHAR(length=100), autoincrement=False, nullable=False),
    sa.Column('role', sa.VARCHAR(length=20), autoincrement=False, nullable=False),
    sa.Column('status', sa.VARCHAR(length=1), autoincrement=False, nullable=False),
    sa.Column('regdate', postgresql.TIMESTAMP(), autoincrement=False, nullable=False),
    sa.PrimaryKeyConstraint('user_no', name='user_pkey')
    )
    op.drop_table('users')
    # ### end Alembic commands ###
