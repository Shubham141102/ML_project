from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import pickle
import numpy as np
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

    periods = 50
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


with open('../model.pkl', 'rb') as f:
    model = pickle.load(f)


def create_test(df):
    df['timestamp'] = pd.to_datetime(df['timestamp'], utc=True)
    df = make_features(df)
    test = df[features]
    df['not_awake'] = model.predict_proba(test)[:,0]
    df['awake'] = model.predict_proba(test)[:.1]
    return df


@app.route('/', methods= ['GET', 'POST'])
def get_message():
    # if request.method == "GET":
    print("Got request in main function")
    return jsonify({"message": "it works!"})


@app.route('/upload_static_file', methods=['POST'])
def upload_static_file():
    print("Got request in static files")
    print(request.files)
    f = request.files['static_file']
    f.save(f.filename)
    df = pd.read_csv(f.filename)
    file = create_test(df)
    print(file)
    resp = {"success": True, "response": "file saved!", "file": file}
    return jsonify(resp), 200


if __name__ == "__main__":
    app.run(host='0.0.0.0', debug=True)