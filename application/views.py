from flask import current_app as app, jsonify, request, render_template, send_file 
from flask_security import auth_required, roles_required
from werkzeug.security import check_password_hash
from .sec import datastore

from .resources import trackData, albumData


from flask import current_app as app, jsonify , request,render_template
from main import datastore 
from application.models import db
from flask_security import auth_required, roles_required
from werkzeug.security import check_password_hash, generate_password_hash
from werkzeug.utils import secure_filename
from flask_restful import marshal,fields , reqparse
from application.models import User, Track, Userplaylist,Album
from flask_login import current_user
import flask_excel as excel
from celery.result import AsyncResult

from application.mail_service import send_message
from datetime import datetime
import pytz
indian_tz = pytz.timezone('Asia/Kolkata')





@app.get('/')
def home():
    return render_template("/index.html")


@app.get('/admin')
@auth_required("token")
@roles_required("admin")
def admin():
    return {"message": "these are the resources provided by the api"}

# @app.post('/user-login')
# def user_login():
#     data = request.get_json()
#     email = data.get('email')
#     if not email:
#         return jsonify({"message": "email not provided"}), 400

#     user = datastore.find_user(email=email)

#     if not user:
#         return jsonify({"message": "User Not Found"}), 404

#     if check_password_hash(user.password, data.get("password")):
#         return jsonify({"token": user.get_auth_token(), "email": user.email, "role": user.roles[0].name})
#     else    :
#         return jsonify({"message": "Wrong Password"}), 400


@app.post('/user-login')
def user_login():
    try:
        data=request.get_json()
        email=data.get("email")
        password=data.get("password")
        print("step1")
        user=datastore.find_user(email=email)
        print("step2")
        if not user:
            return jsonify({"message" : "No User Found"}),400
        if user.active==False:
            return {"message": "User has been deactivated by the Admin, contact User Support"},404
        print(check_password_hash(user.password,password))
        if check_password_hash(user.password, password):
            user.lastlogin=datetime.now().astimezone(indian_tz)
            db.session.commit()
            return jsonify({"token": user.get_auth_token(),"email": user.email, "role" :user.roles[0].name, "user_id": user.id})
        else:
            return {"message":"Incorrect Password"},400
    except Exception as e:
        print("this is the error:", e)
        return {"message":"some error happend"}
    
@app.post('/user-register')
def user_register():
    try:
        
        name=request.json.get("name")
        gender=request.json.get("gender")
        contact=request.json.get("contact")
        email=request.json.get("email")
        password=request.json.get("password")
        roles=request.json.get("roles")
        
        if any(v == None for v in [name, gender, contact, email,password]):
            return {"message":"fill all the details"},400
        


        user=datastore.find_user(email=email)
        if user:
            return {"message":"this email id is already registerd !"},400
        datastore.create_user(name=name,gender=gender,email=email,contact=contact, password=generate_password_hash(password),roles=roles)
        db.session.commit()
        user=datastore.find_user(email=email)
        likedplaylist=Userplaylist(name="liked Songs",user_id=user.id)
        db.session.add(likedplaylist)
        db.session.commit()
        return {"message":"successfully registered"}
    except Exception as e:
        print("an error occured while registering user: ",e)
        return {"message":"Cannot Register User"}


@app.route("/creatormaker", methods=["POST"])
def creatormaker():
    try:

        id=request.form.get("id")
        print(id)
        user=User.query.get(int(id))

        role=datastore.find_role("creator")
        
        if user.roles[0]==role:
            return {"message":"already a creator"},400
        else:
            
            datastore.remove_role_from_user(user,user.roles[0])
            datastore.add_role_to_user(user,role)
            db.session.commit()
            return {"message":"successfully registered as a creator"}
    except Exception as e:
        print("an Error occured while converting user to creator",e)
        return {"message":"couldn't convert user into creator"}

    
@app.route("/usermaker", methods=["POST"])
def usermaker():
    try:

        id=request.form.get("id")
        print(id)
        user=User.query.get(int(id))

        role=datastore.find_role("user")
        
        if user.roles[0]==role:
            return {"message":"already a user"},400
        else:
            
            datastore.remove_role_from_user(user,user.roles[0])
            datastore.add_role_to_user(user,role)
            db.session.commit()
            return {"message":"successfully registered as a creator"}
    except Exception as e:
        print("an Error occured while converting user to creator",e)
        return {"message":"couldn't convert user into creator"}

    
@app.get('/checkliked/<int:userid>/<int:track_id>')
def checkliked(userid,track_id):
    try:
        likedplaylist=db.session.query(Userplaylist).filter_by(user_id=userid)[0]
        for song in likedplaylist.songs:
            if song.id==track_id:
                print("got it")
                return {"message":"Found"}
        print(likedplaylist.songs)
        return {"message":"not found"},204
    except Exception as e:
        print("this is error while getting liked playlist : ",e)
        return {"message": "something went wrong"}, 400




@app.post("/dashboard_graph")
def graph():
    user=request.form.get("current_user")
    tracks=db.session.query(Track).filter(Track.owner==user).all()
    albums=db.session.query(Album).filter(Album.owner==user).all()


    charttracks=db.session.query(Track.likes,Track.name).filter(Track.owner==user).group_by(Track.id).order_by(Track.likes.desc()).all()
    song_like=[]
    name_labels=[]
    for like,name in charttracks:
        song_like.append(like)
        name_labels.append(name)
    data = {
        
        'top_tracks_likes': song_like[:5],
        'top_tracks_names': name_labels[:5]
    }
    return jsonify(data)

@app.post("/admin_graph")
def admingraph():
    
    tracks=Track.query.all()
    albums=Album.query.all()


    charttracks=db.session.query(Track.likes,Track.name).group_by(Track.id).order_by(Track.likes.desc()).all()
    song_like=[]
    name_labels=[]
    for like,name in charttracks:
        song_like.append(like)
        name_labels.append(name)
    data = {
        
        'top_tracks_likes': song_like[:5],
        'top_tracks_names': name_labels[:5]
    }
    print(data)
    return jsonify(data)

@app.post("/admin_pie_graph")
def piegraph():
    
    users=User.query.all()
    usercount=0
    for user in users:
        if "user" in user.roles:

            usercount+=1
    user_creator=[usercount,len(users)-usercount] 

    
    data = {
        
        'user_creator': user_creator
    }
    print(data)
    return jsonify(data)


@app.route("/searchresult")
def results():
    try:
        search_word = request.args.get('query', '')
        tracks=Track.query.msearch(search_word,fields=['name','singer','music','lyricist','lyrics','owner'],limit=10)
        albums=Album.query.msearch(search_word,fields=['title','author','likes','owner'],limit=10)
        searchtracks=[]
        searchalbums=[]
        for track in tracks:
            searchtracks.append(trackData(track))
        for album in albums:
            searchalbums.append(albumData(album))
        data={'searchtracks': searchtracks,
            'searchalbums':searchalbums

        }
        return jsonify(data)
    except Exception as e:
        print("error: ", e)
        return {"message":"couldnt get the result"},400


@app.post("/flagsong/<int:songid>")
def flagsong(songid):
    try:
        
        userid=request.form.get("current_user")
        action=request.form.get("action")
        user=User.query.get(userid)
        if action=="Album":
            album=Album.query.get(songid)
            subject="Flag "+ album.title 
            template=render_template("songflag.html",user_name=user.name,song_name=album.title,action=action)
            send_message("admin@email.com", subject,template)            
            return {"message": "admin has been notified"}
        else :
            song=Track.query.get(songid)
            subject="Flag "+ song.name 
            template=render_template("songflag.html",user_name=user.name,song_name=song.name,action=action)
            send_message("admin@email.com", subject,template)            
            return {"message": "admin has been notified"}
    except Exception as e:
        print("error",e)
        return {"message":"couldnt  flag song"},400