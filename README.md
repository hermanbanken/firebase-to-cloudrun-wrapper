# 'Firebase Functions'-on-'Cloud Run'-wrapper

Cloud Run has a few benefits over Firebase Functions:
- multiple can be active at the same time and have their own url
- it is easy to see which version is live
- it is easy to revert to an old version

Cloud Run has a few downsides over Firebase Functions:
- no Firestore document events (can be shimmed via Firestore Snapshot listeners)
- no auth.user().onCreate events (use the real Firebase Function for this)
- no config() support (but shimmed via process.env) 

## Usage
```bash
# Upload versions
docker build -t gcr.io/my-project/functions .
docker push eu.gcr.io/my-project/functions

# Deploy version v1
gcloud beta run deploy my-project --revision-suffix=v1 --tag=stable \
	--project=my-project --region=europe-west4 --platform=managed \
	--image=eu.gcr.io/my-project/functions

# Deploy version v2 (same container in this example)
gcloud beta run deploy my-project --revision-suffix=v2 --tag=latest \
	--project=my-project --region=europe-west4 --platform=managed \
	--image=eu.gcr.io/my-project/functions
```
