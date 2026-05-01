from flask import Flask
from flask_security import SQLAlchemyUserDatastore, Security
from application.models import db, User, Role
from config import DevelopmentConfig
from application.resources import api
from application.sec import datastore,search,cache
from application.worker import celery_init_app
import flask_excel as excel
from celery.schedules import crontab
from application.tasks import daily_reminder,send_report
from flask_msearch import Search
from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

def create_app():
    app = Flask(__name__)
    app.config.from_object(DevelopmentConfig)
    db.init_app(app)
    api.init_app(app)
    excel.init_excel(app)
    search.init_app(app)
    app.security = Security(app, datastore)
    cache.init_app(app)
    CORS(app)
    with app.app_context():
        import application.views

    return app


app = create_app()
celery_app=celery_init_app(app)

@celery_app.on_after_configure.connect
def send_reminder(sender,**kwargs):
    sender.add_periodic_task(
        crontab(hour=18,minute=29),
        daily_reminder.s("Daily Reminder")
    )

@celery_app.on_after_configure.connect
def send_email(sender,**kwargs):
    sender.add_periodic_task(
        crontab(hour=18,minute=29),
        send_report.s()
    )





if __name__=="__main__":
    app.run(debug=True, port=8080)