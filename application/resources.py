from flask_restful import Resource, Api, reqparse
from flask import current_app

from functools import wraps
from flask_security import current_user
def roles_required_any(*roles):
    def wrapper(fn):
        @wraps(fn)
        def decorated_view(*args, **kwargs):
            if not current_user.is_authenticated:
                return current_app.login_manager.unauthorized()
            for role in roles:
                if current_user.has_role(role):
                    return fn(*args, **kwargs)
            return current_app.login_manager.unauthorized() 
        return decorated_view
    return wrapper




api=Api(prefix="/api")


from flask_restful import Resource,Api,reqparse, fields, marshal_with, marshal,request
from flask_security import auth_required,roles_required, current_user
from application.models import db,Track, Album,User, Userplaylist,Playlistsongs,Role
from flask import jsonify
import os,secrets,base64

from application.sec import datastore,cache


api=Api(prefix='/api')

def save_base64_audio_to_mp3(audio_data_url, output_file_path):
    # Extract base64-encoded data from the data URL
    print("ye lo bhaiya1")
    audio_base64_data = audio_data_url.split(",")[1]
    
    # Decode base64-encoded data to obtain binary audio data
    audio_binary_data = base64.b64decode(audio_base64_data)
    print("ye lo bhaiya2")
    # Write binary audio data to an MP3 file
    with open(output_file_path, 'wb') as file:
        file.write(audio_binary_data)
        print("ye lo bhaiya3")
def name_hasher(filename):
    
    print(filename)
    hash_image=secrets.token_urlsafe(10)
    _,file_extention=os.path.splitext(filename)
    return hash_image + file_extention
    


def trackData(track):
    track_data={ 'id': track.id,
                    'name': track.name,
                    'singer': track.singer,
                    'music': track.music,
                    'lyricist': track.lyricist,
                    'published': str(track.published),
                    'lyrics': track.lyrics,
                    'trackimage': track.trackimage,
                    'mp3file': track.mp3file,
                    'album_id': track.album_id,
                    'owner': track.owner,
                    'likes': track.likes

    }
    return track_data
def albumData(album):
    album_data={ 'id': album.id,
                    'title': album.title,
                    'author': album.author,                   
                    'published': str(album.published),                   
                    'albumcover': album.albumcover,
                    'owner': album.owner,
                    'likes': album.likes
    }
    return album_data

class UserAlbum(Resource):
   def get(self, user_id):
        try:
            albums = db.session.query(Album).filter(Album.owner == user_id).all()
            album_data=[]
            for album in albums:
                data=albumData(album)
                owner_name=datastore.find_user(id=album.owner).name
                data["owner_name"]=owner_name
                album_data.append(data)
                
            
            
            return jsonify(album_data)
        except Exception as e:
            print("error while getting album of user:", e)
            return {"message":"cant get albums"},400


api.add_resource(UserAlbum,'/useralbum/<int:user_id>')

class userTrack(Resource):
   def get(self, user_id):
        try:
            tracks = db.session.query(Track).filter(Track.owner == user_id).all()
            track_data=[]
            for track in tracks:
                data=trackData(track)
                owner_name=datastore.find_user(id=track.owner).name
                data["owner_name"]=owner_name
                track_data.append(data)
                
            
            
            return jsonify(track_data)
        except Exception as e:
            print("error while getting album of user:", e)
            return {"message":"cant get albums"},400


api.add_resource(userTrack,'/usertrack/<int:user_id>')


class AlbumResources(Resource):
    @auth_required("token")
    @roles_required_any('user','admin','creator')
    def get(self,album_id=None):
        if album_id!=None:
            try:
                album = Album.query.get(album_id)
                
                if album!=None:
                    owner_name=datastore.find_user(id=album.owner).name
                    album_data=albumData(album)
                    album_data["owner_name"]=owner_name
                    return album_data
                else:
                    return {"message": "Track not found"},400
            except Exception as e:
                print("this is the exception:",e)
                return {"message":"something went wrong while getting the album"},400
        else:
            try:
                albums=Album.query.all()
                album_data=[]
                for album in albums:
                    data=albumData(album)
                    owner_name=datastore.find_user(id=album.owner).name
                    data["owner_name"]=owner_name
                    album_data.append(data)
                    
               
                
                return jsonify(album_data)
            except Exception as e:
                print("this is the exception:",e)
                return {"message":"something went wrong while getting all albums details "},400
    
    @auth_required("token")
    @roles_required_any('admin','creator')            
    def post(self):
        title=request.form.get('title')
        author=request.form.get('author') 
        owner=request.form.get('owner_id') 
        imageFile=name_hasher(request.form.get('imagename'))
        imageFilePath=os.path.join("static/uploads/images/"+imageFile)
        print(imageFilePath)
        
        album=Album(title=title,author=author,albumcover=imageFile,owner=owner)
        db.session.add(album)
        try:
            imagedata=request.form.get('image')
            
            save_base64_audio_to_mp3(imagedata,imageFilePath)
            db.session.commit()
            return {"message":"file got saved"}
        except Exception as error:
            print(error)
            return{"message":"something went wrong while saving image"},400
    
    @auth_required("token")
    @roles_required_any('admin','creator')    
    def delete(self,album_id):
        try:
            album=Album.query.get(album_id)
            tracks=db.session.query(Track).filter(Track.album_id==album_id)
            for track in tracks:
                trackImagePath=os.path.join("static/uploads/images/"+track.trackimage)
                trackmp3Path=os.path.join("static/uploads/tracks/"+track.mp3file)
                os.remove(trackImagePath)
                os.remove(trackmp3Path)
            imageFilePath=os.path.join("static/uploads/images/"+album.albumcover)
            os.remove(imageFilePath)
            db.session.delete(album)
            db.session.commit()
            return jsonify({"message":"data deleted successfully"})
        except Exception as e:
            print(e)
            return {"message":"an error happend"}
    
    @auth_required("token")
    @roles_required_any('admin','creator')
    def put(self,album_id):
        album=Album.query.get(album_id)
        print("somehting adfhappenf here")
        album.title=request.form.get('title')
        album.author=request.form.get('author')
        print(request.form.get("image"))
        print(request.form.get("imagename")=="")
        if request.form.get("image") and request.form.get("image")!="":
            print("///////////////////////////////////////")
            imageFilePath=os.path.join("static/uploads/images/",album.albumcover)
            os.remove(imageFilePath)
            print("+++++++++++++++++++++++++++++++++++++++")
            

            imageFile=name_hasher(request.form.get('imagename'))
            album.albumcover=imageFile

            imageFilePath=os.path.join("static/uploads/images/",imageFile)
            try:
                imagedata=request.form.get('image')
                
                save_base64_audio_to_mp3(imagedata,imageFilePath)
                db.session.commit()
                return {"message":"file got updated"}
            except Exception as error:
                print(error)
                return{"message":"something went wrong while saving image"},400
        print("here too")
        db.session.commit()
        return {"messsage": "file got updated"}
       
api.add_resource(AlbumResources, '/album/<int:album_id>','/album')





class TrackResources(Resource):     
    @auth_required("token")
    @roles_required_any('user','admin','creator')
    @cache.cached(timeout=50)
    def get(self, track_id=None):
        
        if track_id!=None:
            try:
                track = Track.query.get(track_id)
                

                if track!=None:
                    owner=datastore.find_user(id=track.owner).name
                    
                    album_name=Album.query.get(track.album_id).title
                    print(album_name)
                    track_data=trackData(track)
                    track_data["owner_name"]=owner
                    track_data["album_title"]=album_name
                    return track_data
                else:
                    return {"message": "Track not found"},400
            except Exception as e:
                print("this is the exception:",e)
                return {"message":"something went wrong while getting the track"},400
        else:
            try:
                tracks=Track.query.all()
                track_data=[trackData(track) for track in tracks]
                track_data=[]
                for track in tracks:
                    data=trackData(track)
                    owner_name=datastore.find_user(id=track.owner).name
                    data["owner_name"]=owner_name
                    track_data.append(data)
                    
                return jsonify(track_data)
            except Exception as e:
                print("this is the error:",e)
                return {"message":"something went wrong while getting all tracks details"},400

    @auth_required("token")
    @roles_required_any('admin','creator')    
    def post(self):
        name=request.form.get('name')
        singer=request.form.get('singer')
        music=request.form.get('music')
        lyricist=request.form.get('lyricist')
        lyrics=request.form.get('lyrics')
        album_id=request.form.get('album_id')
        owner_id=request.form.get('owner_id')

        musicFile=name_hasher(request.form.get('audioname'))
        imageFile=name_hasher(request.form.get('imagename'))
        
        musicFilePath=os.path.join("static/uploads/tracks/"+musicFile)
        imageFilePath=os.path.join("static/uploads/images/"+imageFile)

        track=Track(name=name,singer=singer,music=music,lyricist=lyricist,lyrics=lyrics,album_id=album_id,owner=owner_id,trackimage=imageFile,mp3file=musicFile)
        db.session.add(track)
        
        try:
            imagedata=request.form.get('image')
            
            audiodata=request.form.get('audioDataUrl')
            
            save_base64_audio_to_mp3(audiodata, musicFilePath)
            save_base64_audio_to_mp3(imagedata,imageFilePath)
            db.session.commit()
            return {"message":"file got saved"}
        except Exception as error:
            print(error)
            return {"message":"something went wrong while saving image"},400
    
    @auth_required("token")
    @roles_required_any('admin','creator')
    def delete(self,track_id):
        
        try:

            track=Track.query.get(track_id)
            
            trackImagePath=os.path.join("static/uploads/images/"+track.trackimage)
            trackmp3Path=os.path.join("static/uploads/tracks/"+track.mp3file)
            os.remove(trackImagePath)
            os.remove(trackmp3Path)


            db.session.delete(track)
            db.session.commit()
            print("successfully printed")
            return jsonify({"message":"data deleted successfully"})
        except Exception as e:
            print("an error occured while deleting",e)
            return {"message":"an error happend"}
    @roles_required_any('admin',"creator")
    
    @auth_required("token")
    @roles_required_any('admin','creator')
    def put(self,track_id):

        track=Track.query.get(track_id)
        track.name=request.form.get('name')
        track.singer=request.form.get('singer')
        track.music=request.form.get('music')
        track.lyricist=request.form.get('lyricist')
        track.lyrics=request.form.get('lyrics')
        track.album_id=request.form.get('album_id')
      
       
        if request.form.get("image") and request.form.get("image")!="":
            print("///////////////////////////////////////")
            imageFilePath=os.path.join("static/uploads/images/"+track.trackimage)
            os.remove(imageFilePath)
            print("+++++++++++++++++++++++++++++++++++++++")
            

            imageFile=name_hasher(request.form.get('imagename'))
            track.trackimage=imageFile

            imageFilePath=os.path.join("static/uploads/images/"+imageFile)
            try:
                imagedata=request.form.get('image')
                
                save_base64_audio_to_mp3(imagedata,imageFilePath)
                db.session.commit()
                return {"message":"file got updated"}
            except Exception as error:
                print(error)
                return{"message":"something went wrong while saving image"},400
        if request.form.get("audioDataUrl") and request.form.get("audioDataUrl")!="":
            print("///////////////////////////////////////")
            audiofilepath=os.path.join("static/uploads/tracks/",track.mp3file)
            os.remove(audiofilepath)
            print("+++++++++++++++++++++++++++++++++++++++")
            

            audiofile=name_hasher(request.form.get('imagename'))
            track.trackimage=audiofile

            audiofilepath=os.path.join("static/uploads/images/",audiofile)
            try:
                imagedata=request.form.get('image')
                
                save_base64_audio_to_mp3(imagedata,audiofilepath)
                db.session.commit()
                return {"message":"file got updated"}
            except Exception as error:
                print(error)
                return{"message":"something went wrong while saving image"},400
        db.session.commit()
        return {"messsage": "file got updated"}

api.add_resource(TrackResources, '/track/<int:track_id>',"/track")


class PlaylistResources(Resource):
    @auth_required("token")
    @roles_required_any('user','creator','admin')
    def get(self, user_id):
        try:
            playlists = Userplaylist.query.filter_by(user_id=user_id).all()
            playlist_data = [{"name": playlist.name, "id": playlist.id, "user_id": playlist.user_id} for playlist in playlists]
            return jsonify(playlist_data)
        except Exception as e:
            print("error ocurred while getting user's playlists : ", e)
            return {"message" : "error fetchinh Playlist of the user"}
    
    @auth_required("token")
    @roles_required_any('user','creator','admin')
    def post(self):

        try:
            name=request.form.get("name")
            if name==None:
                return {"message": "Playlist name is not provided"},400
            name=request.form.get("name")
            user_id=request.form.get("current_user")
            playlist=Userplaylist(name=name, user_id=user_id)
            playlists=db.session.query(Userplaylist).filter(Userplaylist.user_id==user_id).all()
            for playlistname in playlists:
                if playlistname.name==name:
                    return {"message": "Playlist with same name exist"},400
            db.session.add(playlist)
            db.session.commit()  
            return {"message":"Playlist created"}
        except Exception as e:
            print("this is the exception",e)
            return {"message": "Error in Creating  Playlist"} ,400 
    
    def delete(self):
        pass
    
api.add_resource(PlaylistResources, '/playlist/<int:user_id>',"/playlist")


class PlaylistSongs(Resource):
    @auth_required("token")
    @roles_required_any('user','creator','admin')
    def get(self, id):
        try:
            playlist=Userplaylist.query.get_or_404(id)
            print(playlist.songs)
            track=[]
            # track=[trackData(Track.query.get(song.id)) for song in playlist.songs]
            
            for song in playlist.songs:
                album_id=Track.query.get(song.id).album_id
                album=Album.query.get(album_id)
                trackdata=trackData(Track.query.get(song.id))
                trackdata["album_name"]=album.title
                track.append(trackdata)
            return track
        except Exception as e:
            print("this is the error while getting songs of the playlist",e)
            return {"message": "error fetching songs"}
    @auth_required("token")
    @roles_required_any('admin','creator','user')
    def post(self):
        try:
            playlist_id=request.form.get("playlist_id")
            song_id=request.form.get("song_id")

            playlist=Userplaylist.query.filter_by(id=playlist_id).first()
            
            
            if any(song.id==int(song_id) for song in playlist.songs):
                return {"message": "Song is already present in the playlist"},400
            
            allsongs=Playlistsongs.query.all()

            if playlist.name=='liked Songs':
                
                track=Track.query.get(song_id)
                print(track.likes)
                track.likes=int(track.likes)+1
                print("*************************")
                db.session.commit()
                print(track.likes)
            if any(song.id==int(song_id) for song in allsongs):
                song=Playlistsongs.query.filter_by(id=song_id).first()
                playlist.songs.append(song)
                db.session.commit()
                return {"message":"Song is added to Playlist"}

            
            song=Playlistsongs(id=song_id)
            db.session.add(song)
            db.session.flush()
            song=Playlistsongs.query.filter_by(id=song_id).first()
            playlist.songs.append(song)
            print(song)
            db.session.commit()
            return {"message" :"Song is added to Playlist"}
        except Exception as e:
            print(e)
            return {"message" : "Couldn't save playlist"},400        
    @auth_required("token")
    @roles_required_any('admin','creator','user')
    def delete(self):
        try:
            song_id=request.form.get("song_id")
            playlist_id=request.form.get("playlist_id")
            
            song=Playlistsongs.query.get_or_404(int(song_id))
            playlist=Userplaylist.query.get_or_404(playlist_id)
            if playlist.name=='liked Songs':
                    
                    track=Track.query.get(song_id)
                    print(track.likes)
                    print("****************deletetion")
                    track.likes=int(track.likes)-1
                    db.session.commit()
                    print(track.likes)
            playlist.songs.remove(song)
            db.session.commit()
            return {"message" :"Song has been removed"}
        except Exception as e:
            print("an error occurred while deleting:", e)
            return {"message":"Cannot delete the Songs"},400
    

api.add_resource(PlaylistSongs, '/playlistsongs/<int:id>',"/playlistsongs")


          

def userjson(user):
    data={"id": user.id,
        "name":user.name,
        "email": user.email,
        "gender": user.gender,
        "contact":user.contact,
        "doj": user.doj.strftime("%Y-%m-%d"),
        "last_login": user.lastlogin,
        "active": user.active,
        "flagged": user.flagged
    }
    return data



#this is for getting user info for the admin
class Userpage(Resource):
    @auth_required("token")
    @roles_required_any('admin')
    def get(self, role):
        try:
            users=User.query.filter(User.roles.any(Role.name.in_([role]))).all()
            
            data=[]
            for user in users:
                data.append(userjson(user))
            return jsonify(data)
        except Exception as e:
            print("exception : ", e)
            return {"message": "Couldn't get User"},400
    @auth_required("token")
    @roles_required_any('admin')
    def put(self, id): #this is to flagged
        try:
            status= request.form.get("flag")
            check= request.form.get("check")
            user=User.query.get(id)
            if check=="flag":
                print("status:", status)
                print(user.flagged)
                if status=="false":
                    print("true")
                    user.flagged=True
                else:
                    print("false")
                    user.flagged=False
                db.session.commit()
                return {"message": "user has been flagged"}
            elif check=="active":
                if status=="false":
                    user.active=True
                else:
                    user.active=False
                db.session.commit()
                return {"message":"user active status has been changed"}
                
        except Exception as e:
            print("error: ", e)
            return {"message":"can't flag user"}, 400
    @auth_required("token")
    @roles_required_any('admin')   
    def delete(self,id):
        try:
            user=User.query.get(id)
            db.session.delete(user)
            print("user has been deleted")
            db.session.commit()
            return {"message" :"User has been deleted"}
        except Exception as e:
            print("an error occurred while deleting:", e)
            return {"message":"Cannot delete the User"},400
    

api.add_resource(Userpage,'/getuser/<string:role>', '/getuser/<int:id>')
        