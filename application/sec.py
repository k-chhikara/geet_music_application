from flask_security import SQLAlchemyUserDatastore
from .models import db, User, Role
import os

from flask_msearch import Search
from flask_caching import Cache


search=Search()

datastore = SQLAlchemyUserDatastore(db, User, Role)


cache=Cache()
