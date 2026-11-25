from fastapi.testclient import TestClient
from app.main import app

def test_catalog():
    with TestClient(app) as client:
        assert client.get('/api/v1/health').json()['status']=='ok'
        pups=client.get('/api/v1/puppies?status=available').json()
        assert len(pups)==15
        assert client.get('/api/v1/puppies/'+pups[0]['slug']).status_code==200
        assert client.get('/api/v1/puppies/no-such-puppy').status_code==404
        assert all(p['origin']=='imported' for p in client.get('/api/v1/puppies?origin=imported').json())
        assert len(client.get('/api/v1/puppies?status=adopted').json())==27
        assert len(client.get('/api/v1/families').json())==64

def test_enquiry():
    with TestClient(app) as client:
        data={'name':'Test Person','phone':'+971 50 123 4567','email':'test@example.com','puppy_slug':'maltipoo-max-male'}
        r=client.post('/api/v1/enquiries',json=data)
        assert r.status_code==201 and r.json()['id']
        assert client.post('/api/v1/enquiries',json={**data,'website':'spam'}).status_code==400
        assert client.post('/api/v1/enquiries',json={**data,'phone':'bad'}).status_code==422
        assert client.post('/api/v1/enquiries',json={**data,'puppy_slug':'unknown'}).status_code==422
