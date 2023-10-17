from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import pandas as pd
import pickle
import numpy as np
from itertools import groupby
app = Flask(__name__)
CORS(app)

features = ["hour",
            "anglez",
            "anglez_rolling_mean",
            "anglez_rolling_max",
            "anglez_rolling_std",
            "anglez_diff",
            "anglez_diff_rolling_mean",
            "anglez_diff_rolling_max",
            "enmo",
            "enmo_rolling_mean",
            "enmo_rolling_max",
            "enmo_rolling_std",
            "enmo_diff",
            "enmo_diff_rolling_mean",
            "enmo_diff_rolling_max",
           ]
def make_features(df):
    # parse the timestamp and create an "hour" feature
    df['timestamp'] = pd.to_datetime(df['timestamp'])
    df["hour"] = df["timestamp"].dt.hour

    periods = 10
    df["anglez"] = abs(df["anglez"])
    df["anglez_diff"] = df.groupby('series_id')['anglez'].diff(periods=periods).fillna(method="bfill").astype('float16')
    df["enmo_diff"] = df.groupby('series_id')['enmo'].diff(periods=periods).fillna(method="bfill").astype('float16')
    df["anglez_rolling_mean"] = df["anglez"].rolling(periods, center=True).mean().fillna(method="bfill").fillna(
        method="ffill").astype('float16')
    df["enmo_rolling_mean"] = df["enmo"].rolling(periods, center=True).mean().fillna(method="bfill").fillna(
        method="ffill").astype('float16')
    df["anglez_rolling_max"] = df["anglez"].rolling(periods, center=True).max().fillna(method="bfill").fillna(
        method="ffill").astype('float16')
    df["enmo_rolling_max"] = df["enmo"].rolling(periods, center=True).max().fillna(method="bfill").fillna(
        method="ffill").astype('float16')
    df["anglez_rolling_std"] = df["anglez"].rolling(periods, center=True).std().fillna(method="bfill").fillna(
        method="ffill").astype('float16')
    df["enmo_rolling_std"] = df["enmo"].rolling(periods, center=True).std().fillna(method="bfill").fillna(
        method="ffill").astype('float16')
    df["anglez_diff_rolling_mean"] = df["anglez_diff"].rolling(periods, center=True).mean().fillna(
        method="bfill").fillna(method="ffill").astype('float16')
    df["enmo_diff_rolling_mean"] = df["enmo_diff"].rolling(periods, center=True).mean().fillna(method="bfill").fillna(
        method="ffill").astype('float16')
    df["anglez_diff_rolling_max"] = df["anglez_diff"].rolling(periods, center=True).max().fillna(method="bfill").fillna(
        method="ffill").astype('float16')
    df["enmo_diff_rolling_max"] = df["enmo_diff"].rolling(periods, center=True).max().fillna(method="bfill").fillna(
        method="ffill").astype('float16')
    return df

def get_event(df):
    lstCV = zip(df.series_id, df.smooth)
    lstPOI = []
    for (c, v), g in groupby(lstCV, lambda cv:
                            (cv[0], cv[1]!=0 and not pd.isnull(cv[1]))):
        llg = sum(1 for item in g)
        if v is False:
            lstPOI.extend([0]*llg)
        else:
            lstPOI.extend(['onset']+(llg-2)*[0]+['wakeup'] if llg > 0.82 else [0])
    return lstPOI

with open('model.pkl', 'rb') as f:
    model = pickle.load(f)


def create_test(df,smoothingval):
    df['timestamp'] = pd.to_datetime(df['timestamp'], utc=True)

    df = make_features(df)
    test = df[features]
    # print(test)
    df['not_awake'] = model.predict_proba(test)[:,0]
    df['awake'] = model.predict_proba(test)[:,1]
    smoothing_length = smoothingval
    # smoothing_length = 500
    df["score"] = df["awake"].rolling(smoothing_length, center=True).mean().fillna(method="bfill").fillna(
        method="ffill")
    # train["score"]  = train["awake"].rolling(smoothing_length,center=True).mean()
    df["smooth"] = df["not_awake"].rolling(smoothing_length, center=True).mean().fillna(method="bfill").fillna(
        method="ffill")
    df["event"] = get_event(df)
    return df



@app.route('/', methods= ['GET', 'POST'])
def get_message():
    # if request.method == "GET":
    print("Got request in main function")
    return render_template('index.html')


@app.route('/upload_static_file', methods=['POST'])
def upload_static_file():
    print("Got request in static files")
    # print(request.files)
    if request.form.get('toggle') == '1':
        checkbox_value = "Checkbox is checked"
        print(checkbox_value)
        smoothingval = 3300
    else:
        checkbox_value = "Checkbox is not checked"
        print(checkbox_value)
        smoothingval = 400
    f = request.files['static_file']
    print(request.files)
    f.save(f.filename)
    df = pd.read_parquet(f.filename)
    file = create_test(df,smoothingval)


    # print(file)
    # json_data = file.to_json()
    # json_data = arr.to_json()
    # awake = file['awake'].to_json(orient='records')
    # not_awake = file['not_awake'].to_json(orient='records')
    timeline = file['hour'].to_json(orient = 'records')
    score = file['score'].to_json(orient='records')
    smooth = file['smooth'].to_json(orient='records')
    # event = file['event'].to_json(orient='records')
    # resp = {"success": True, "response": "file saved!", "awake": awake, "not_awake" : not_awake,"score":score,"smooth":smooth,"event":event}
    resp = {"success": True, "response": "file saved!" ,"score":score,"smooth":smooth, "timeline" : timeline}
    # print(resp)
    return jsonify(resp), 200


if __name__ == "__main__":
    app.run(host='0.0.0.0', debug=True)