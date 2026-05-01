from celery import shared_task

from flask import render_template
from application.models import Track,User,Role,db, Album
from application.mail_service import send_message
from datetime import datetime
import pytz
indian_tz = pytz.timezone('Asia/Kolkata')

import json




@shared_task(ignore_result=True)
def daily_reminder( subject):
    users = User.query.filter(User.roles.any(Role.name.in_(["user","creator"]))).all()
    timenow=datetime.now(),
    for user in users:

        if user.lastlogin:
            timedifference=timenow-user.lastlogin
            hours=timedifference.total_seconds()/3600
            if hours<24:
                print(f"sending mail to {user.email}")
                template=render_template("daily_reminder.html",user_name=user.name)
                send_message(user.email, subject,template)
        
       
    return "OK"

@shared_task(ignore_result=False)
def send_report():
    users=User.query.filter(User.roles.any(Role.name.in_(["creator"]))).all()
    
    for user in users:
        data=""
        
        tracks=db.session.query(Track).filter(Track.owner==user.id).all()
        albums=db.session.query(Album).filter(Album.owner==user.id).all()


        charttracks=db.session.query(Track.likes,Track.name).filter(Track.owner==user.id).group_by(Track.id).order_by(Track.likes.desc()).all()
        song_like=[]
        name_labels=[]
        for like,name in charttracks:
            song_like.append(like)
            name_labels.append(name)
        
        template=render_template("report.html",tracks=tracks,albums=albums,song_like=json.dumps(song_like[:5]),name_labels=json.dumps(name_labels[:5]))

        subject=user.name + " Monthly Report"
        
        send_message(user.email,subject ,template)
    return "ok"