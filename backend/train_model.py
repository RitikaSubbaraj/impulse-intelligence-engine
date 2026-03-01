import pandas as pd
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
import joblib

# Load dataset
df = pd.read_csv("../data/online_retail.csv", encoding="ISO-8859-1")

df = df.dropna(subset=["CustomerID"])
df["CustomerID"] = df["CustomerID"].astype(int)
df = df[~df["InvoiceNo"].str.startswith("C")]
df = df[df["Quantity"] > 0]
df["InvoiceDate"] = pd.to_datetime(df["InvoiceDate"])
df["TotalPrice"] = df["Quantity"] * df["UnitPrice"]

df_invoice = df.groupby(
    ["InvoiceNo", "CustomerID", "InvoiceDate"],
    as_index=False
).agg({"TotalPrice": "sum"})

df_invoice = df_invoice.sort_values(["CustomerID", "InvoiceDate"])

df_invoice["Hour"] = df_invoice["InvoiceDate"].dt.hour
df_invoice["DayOfWeek"] = df_invoice["InvoiceDate"].dt.dayofweek
df_invoice["IsWeekend"] = df_invoice["DayOfWeek"].isin([5,6]).astype(int)

df_invoice["PrevPurchaseTime"] = df_invoice.groupby("CustomerID")["InvoiceDate"].shift(1)
df_invoice["TimeGapHours"] = (
    df_invoice["InvoiceDate"] - df_invoice["PrevPurchaseTime"]
).dt.total_seconds() / 3600

df_invoice["UserAvgSpend"] = df_invoice.groupby("CustomerID")["TotalPrice"].transform("mean")
df_invoice["SpendDeviation"] = df_invoice["TotalPrice"] - df_invoice["UserAvgSpend"]

df_invoice["LateNightFlag"] = df_invoice["Hour"].isin([23,0,1,2,3]).astype(int)

df_invoice = df_invoice.dropna(subset=["TimeGapHours"])

df_invoice["UserGap25"] = df_invoice.groupby("CustomerID")["TimeGapHours"].transform(
    lambda x: x.quantile(0.25)
)

df_invoice["UserSpend75"] = df_invoice.groupby("CustomerID")["SpendDeviation"].transform(
    lambda x: x.quantile(0.75)
)

df_invoice["ImpulseFlag"] = (
    (
        (df_invoice["TimeGapHours"] < df_invoice["UserGap25"]) &
        (df_invoice["SpendDeviation"] > df_invoice["UserSpend75"])
    )
    |
    (
        (df_invoice["LateNightFlag"] == 1) &
        (df_invoice["SpendDeviation"] > 0)
    )
).astype(int)

features = ["TimeGapHours","SpendDeviation","Hour","IsWeekend","LateNightFlag"]

X = df_invoice[features]
y = df_invoice["ImpulseFlag"]

scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

model = LogisticRegression(class_weight="balanced")
model.fit(X_scaled, y)

joblib.dump(model, "model.pkl")
joblib.dump(scaler, "scaler.pkl")

print("Model and scaler saved successfully.")