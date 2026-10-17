# 🚀 Clickstream Analytics Data Pipeline – Case Study

## 🎯 Overview
This case study walks through the end-to-end design of a **serverless, cloud-native data pipeline** for processing large-scale clickstream data.  
The goal: transform semi-structured web interaction logs into **queryable, analytics-ready datasets** — supporting both near-real-time insights and cost-effective long-term storage.

---

## 🧩 Business Context
A global e-commerce company wants to analyze **user behavior** (page views, clicks, and purchases) across its digital platforms.  
Currently, raw clickstream events arrive as **JSON files every hour** in an Amazon S3 bucket.  
Business stakeholders need:
- Daily and hourly insights on user engagement patterns  
- Ability to query data efficiently using Athena and Redshift  
- Event-driven alerts for key actions (e.g., purchases)  
- Cost control, security, and scalability across all layers  

---

## 🏗️ Solution Summary
The proposed architecture builds a **modular, fault-tolerant data lakehouse pipeline** leveraging AWS native services:

| Layer | AWS Services | Purpose |
|--------|---------------|----------|
| **Ingestion** | S3, Glue Crawler | Store and catalog raw JSON clickstream data |
| **Transformation** | Glue (PySpark) / Lambda | Normalize into a star schema (fact + dim) and convert to Parquet |
| **Storage & Querying** | S3 (processed), Redshift Spectrum, Athena | Provide efficient analytical access |
| **Event-Driven Triggers** | EventBridge, Lambda, SNS | React in real time to “purchase” or other key events |
| **Governance & IaC** | IAM, KMS, CloudWatch, Terraform | Secure, monitor, and automate infrastructure |

---

## 🧠 Design Goals
1. **Scalability:** Handle millions of events per day without manual scaling.  
2. **Performance:** Use Parquet + partitioning to minimize Athena scan costs.  
3. **Cost Efficiency:** Serverless-first design — pay only for compute used.  
4. **Security:** Full encryption at rest (KMS) and in transit (TLS).  
5. **Automation:** End-to-end provisioning and monitoring via Terraform + CloudWatch.  

---

## 📦 Deliverables
- **Architecture Diagram** – illustrating data flow from ingestion to analytics.  
- **Sample Code Snippets** – PySpark (ETL), SQL (queries), and Lambda pseudocode.  
- **Short Design Write-up** – explaining schema design, AWS choices, and trade-offs.  

---

## 🧭 Project Flow
1. [**Part 1 – Data Ingestion & Cataloging**](#part-1--data-ingestion--cataloging)  
   Define partitioning, schema registration, and Athena optimization.  
2. [**Part 2 – Data Transformation**](#part-2--data-transformation)    
   Normalize raw JSON → Parquet star schema (fact_clicks, dim_users).  
3. [**Part 3 – Data Warehouse Integration**](#part-3--data-warehouse-integration)  
   Integrate processed data into Redshift (or Spectrum external tables).  
4. [**Part 4 – Event-Driven Component**](#part-4--event-driven-component)  
   Trigger workflows for key events using EventBridge + Lambda + SNS.  
5. [**Part 5 – Non-Functional Considerations**](#part-5--non-functional-considerations)  
   Implement security, cost optimization, quality checks, and IaC automation.  

---

## 💬 Summary
This pipeline demonstrates a **production-ready, AWS-native clickstream analytics system** — balancing scalability, speed, cost, and reliability.  
It is designed to evolve: from simple hourly JSON ingestion to full-fledged real-time event processing as traffic grows.

---

## 💡 Key Takeaways
Every strong data platform starts with clear **separation of layers** — raw, processed, curated — and builds upward from **secure, cost-efficient foundations**.

<a name="part-1--data-ingestion--cataloging"></a>
# 📦 Part 1 – Data Ingestion & Cataloging

## 🎯 Objective
Design an ingestion and cataloging layer for raw clickstream JSON data landing in:
s3://company-raw/clickstream/YYYY/MM/DD/HH/

---

## 🧱 S3 Organization & Partitioning

**Proposed S3 Structure**
```text
s3://company-raw/clickstream/
    └── year=YYYY/
        └── month=MM/
            └── day=DD/
                └── hour=HH/
                    └── part-0000.json
```

**Rationale**
1. Partitioning by `year`, `month`, `day`, and `hour` ensures efficient time-based queries.  
2. Aligns with Glue and Athena partition pruning for faster performance.  
3. Keeps data lake compatible with downstream Parquet writes and lifecycle rules.

**Best Practices**
- Store each ingestion batch under a unique prefix (e.g., hour).
- Avoid small files by merging JSON objects before writing (improves Athena performance).
- Use a consistent schema and naming convention to simplify Glue crawlers.

---

## 🧩 Glue Data Catalog & Table Schema

**Glue Table Definition Example**
Database: clickstream_raw  
Table: click_events_raw  
Location: s3://company-raw/clickstream/

```sql
Columns:
    user_id           string
    session_id        string
    event_type        string
    event_timestamp   timestamp
    device_type       string
    page_url          string
    referrer_url      string
    metadata          map<string, string>

Partitions:
    year              int
    month             int
    day               int
    hour              int
```
Storage format: JSON  
Compression: None (raw stage)  

```sql
**Create Table (SQL for Athena/Glue Catalog Registration)**
CREATE EXTERNAL TABLE clickstream_raw.click_events_raw (
    user_id string,
    session_id string,
    event_type string,
    event_timestamp timestamp,
    device_type string,
    page_url string,
    referrer_url string,
    metadata map<string,string>
)
PARTITIONED BY (year int, month int, day int, hour int)
ROW FORMAT SERDE 'org.openx.data.jsonserde.JsonSerDe'
LOCATION 's3://company-raw/clickstream/';

**Adding Partitions**
ALTER TABLE clickstream_raw.click_events_raw
ADD PARTITION (year=2024, month=11, day=04, hour=15)
LOCATION 's3://company-raw/clickstream/2024/11/04/15/';
```
---

## 🔍 Athena Query Considerations

1. **Partition Pruning**
   Use WHERE filters on partition keys:
   SELECT * FROM clickstream_raw.click_events_raw
   WHERE year=2024 AND month=11 AND day=04;

2. **Cost Control**
   - Each query scans only relevant partitions → reduces S3 read cost.
   - Avoid SELECT *; project only required columns.

3. **Schema Drift**
   - Athena infers schema from JSON; inconsistent JSON keys can cause nulls.
   - Mitigate via schema validation before loading to raw bucket.

4. **Performance**
   - Use `CTAS` (CREATE TABLE AS SELECT) to convert large JSONs to columnar Parquet in next stage.
   - Partition discovery can be automated using Glue Crawler or `MSCK REPAIR TABLE`.

---

## 🧠 Summary of Design Choices

| Aspect | Decision | Reason |
|--------|-----------|--------|
| Partitioning | Year/Month/Day/Hour | Time-based filtering & efficient Athena queries |
| File Format | JSON | Retain raw fidelity |
| Catalog | Glue Data Catalog | Central schema registry for Athena & ETL jobs |
| Query Engine | Athena | Serverless, cost-efficient data exploration |
| Governance | S3 IAM + KMS encryption | Security & compliance |

---

## 💡 Kay Takeaways
Always partition S3 data by **query access patterns** (typically time-based) before cataloging — this single step saves 80–90% of Athena scan costs.

<a name="part-2--data-transformation"></a>
# ⚙️ Part 2 – Data Transformation

## 🎯 Objective
Transform raw JSON clickstream data into a **star schema** consisting of:
- fact_clicks  
- dim_users  
and store it in S3 as **Parquet (compressed, partitioned)** for downstream analytics.

---

## 🧩 Transformation Design

**Input**
s3://company-raw/clickstream/year=YYYY/month=MM/day=DD/hour=HH/

**Output**
```text
s3://company-processed/clickstream/
    ├── fact_clicks/year=YYYY/month=MM/day=DD/
    └── dim_users/
```
**Schema Overview**
```sql
fact_clicks
    click_id            string
    user_id             string
    session_id          string
    event_type          string
    event_timestamp     timestamp
    device_type         string
    page_url            string
    referrer_url        string
    year                int
    month               int
    day                 int

dim_users
    user_id             string
    country             string
    signup_date         date
    device_preferences  string
    last_seen           timestamp
```
**Partitioning Strategy**
- fact_clicks: Partition by year, month, day  
- dim_users: Not partitioned (small cardinality, frequent lookups)  
- Format: Parquet  
- Compression: Snappy  

---

## 🧠 Schema Design Rationale

| Component | Reason |
|------------|--------|
| Star schema | Supports efficient OLAP-style queries (joins + aggregates). |
| Fact table (clicks) | Captures high-volume, event-level data. |
| Dimension table (users) | Captures slowly changing, descriptive user attributes. |
| Parquet + Snappy | Columnar compression = 80% smaller + 10x faster Athena queries. |
| Partition by date | Enables incremental refresh and partition pruning. |

---

## 🐍 PySpark Transformation Code (Sample)
```python
from pyspark.sql import SparkSession
from pyspark.sql.functions import col, year, month, dayofmonth, monotonically_increasing_id

spark = SparkSession.builder.appName("ClickstreamTransform").getOrCreate()

# Read raw JSON
raw_df = spark.read.json("s3://company-raw/clickstream/*/*/*/*/")

# Derive dimension table
dim_users_df = (
    raw_df.select("user_id", "device_type", "metadata.country", "metadata.signup_date")
          .dropDuplicates(["user_id"])
          .withColumnRenamed("device_type", "device_preferences")
)

# Derive fact table
fact_clicks_df = (
    raw_df.withColumn("click_id", monotonically_increasing_id())
          .withColumn("year", year(col("event_timestamp")))
          .withColumn("month", month(col("event_timestamp")))
          .withColumn("day", dayofmonth(col("event_timestamp")))
          .select("click_id", "user_id", "session_id", "event_type",
                  "event_timestamp", "device_type", "page_url", "referrer_url",
                  "year", "month", "day")
)

# Write outputs in Parquet
fact_clicks_df.write.mode("overwrite") \
    .partitionBy("year", "month", "day") \
    .parquet("s3://company-processed/clickstream/fact_clicks/")

dim_users_df.write.mode("overwrite") \
    .parquet("s3://company-processed/clickstream/dim_users/")
```
---

## ⚙️ Alternative: AWS Lambda (for lightweight transformations)

Use Lambda + Python when:
- Volume is small (few MBs/hour)
- Transformation is JSON normalization or flattening
```python
Example pseudocode:
def lambda_handler(event, context):
    for record in event['Records']:
        data = json.loads(record['body'])
        normalized = {
            "user_id": data["user_id"],
            "event_type": data["action"],
            "timestamp": data["timestamp"]
        }
        s3.put_object(
            Bucket="company-processed",
            Key=f"clickstream/{normalized['timestamp'][:10]}/{uuid4()}.json",
            Body=json.dumps(normalized)
        )
```
---

## 🧮 Performance & Scaling Considerations
1. **Glue Job Parameters**
   - DynamicFrame to DataFrame conversion for schema enforcement.
   - Enable pushdown predicate for partition writes.
2. **Partition Evolution**
   - Append new partitions daily; use Glue crawler to update catalog.
3. **Data Skew**
   - Repartition on high-cardinality columns if one user dominates.
4. **Small File Problem**
   - Use `coalesce()` to reduce output files per partition.

---

## 💡 Key Takeaway
Always transform raw data into **columnar + partitioned** structures early — the combination of Parquet and date-based partitions is the backbone of every efficient data lake.

<a name="part-3--data-warehouse-integration"></a>
# 🏗️ Part 3 – Data Warehouse Integration

## 🎯 Objective
Load the **processed Parquet data** from S3 into Amazon **Redshift** (or query through **Spectrum**) to enable analytical joins and aggregations between fact and dimension tables.

---

## 🧩 Integration Architecture
```text
S3 (Processed Data)
    ↓
Redshift Spectrum External Schema (read-only)
    ↓
Redshift Internal Tables (optional for high-performance analytics)
``````
**Workflow**
1. Glue catalog registers processed Parquet data (fact_clicks and dim_users).
2. Redshift Spectrum uses the same catalog to create external tables.
3. Optionally, load data into Redshift internal tables for performance-critical workloads.
4. Analysts query via Redshift SQL combining external and internal data sources.

---

## ⚙️ Redshift External Table Definition

External Schema
```sql
CREATE EXTERNAL SCHEMA spectrum_clickstream
FROM DATA CATALOG
DATABASE 'clickstream_processed'
IAM_ROLE 'arn:aws:iam::<account-id>:role/RedshiftSpectrumRole'
CREATE EXTERNAL DATABASE IF NOT EXISTS;

External Tables
CREATE EXTERNAL TABLE spectrum_clickstream.fact_clicks (
    click_id string,
    user_id string,
    session_id string,
    event_type string,
    event_timestamp timestamp,
    device_type string,
    page_url string,
    referrer_url string
)
PARTITIONED BY (year int, month int, day int)
STORED AS PARQUET
LOCATION 's3://company-processed/clickstream/fact_clicks/';

CREATE EXTERNAL TABLE spectrum_clickstream.dim_users (
    user_id string,
    country string,
    signup_date date,
    device_preferences string,
    last_seen timestamp
)
STORED AS PARQUET
LOCATION 's3://company-processed/clickstream/dim_users/';
```
---

## 🧮 Analytical Query Example
```sql
SELECT
    u.country,
    c.user_id,
    COUNT(*) AS clicks_per_user,
    DATE_TRUNC('day', c.event_timestamp) AS click_date
FROM spectrum_clickstream.fact_clicks AS c
JOIN spectrum_clickstream.dim_users AS u
    ON c.user_id = u.user_id
WHERE c.year = 2024 AND c.month = 11
GROUP BY 1, 2, 4
ORDER BY clicks_per_user DESC;
```
**Purpose**
Aggregates click counts per user per day, joining fact and dimension data directly from S3 using Spectrum.

---

## ⚖️ Redshift vs Spectrum Trade-offs

| Dimension | Redshift Internal Tables | Spectrum External Tables |
|------------|--------------------------|---------------------------|
| **Storage** | Data lives inside Redshift cluster | Data remains in S3 |
| **Cost** | Charged for storage + compute | Pay only for S3 scan (per TB) |
| **Performance** | Fastest (local columnar storage, optimized joins) | Slower (S3 I/O overhead, limited caching) |
| **Flexibility** | Fixed schema, tight control | Easily refreshed from Glue catalog |
| **Use Case** | High-frequency analytical workloads | Large cold datasets, infrequent queries |
| **Maintenance** | Requires VACUUM and ANALYZE | Auto-managed metadata via Glue |

**Hybrid Strategy**
- Keep **hot** (recent) data in Redshift internal tables.
- Keep **cold** (historical) data in S3, queried through Spectrum.
- Use **UNION ALL** or **Redshift federated queries** to combine both layers seamlessly.

---

## 🚀 Data Load Options

1. **COPY Command (for internal tables)**
   COPY fact_clicks
   FROM 's3://company-processed/clickstream/fact_clicks/'
   IAM_ROLE 'arn:aws:iam::<account-id>:role/RedshiftCopyRole'
   FORMAT AS PARQUET;

2. **CTAS Pattern**
```sql
   CREATE TABLE fact_clicks_staging AS
   SELECT * FROM spectrum_clickstream.fact_clicks
   WHERE year=2024 AND month=11;
```
---

## 🧠 Summary of Design Choices

| Aspect | Decision | Reason |
|--------|-----------|--------|
| Integration Method | Redshift Spectrum | Serverless and low-cost querying directly from S3 |
| Schema Source | Glue Data Catalog | Centralized schema control |
| File Format | Parquet | Enables predicate pushdown & compression |
| Optimization | Partition pruning + compression | Minimizes I/O and cost |
| Trade-off | Slightly slower than internal Redshift tables | But avoids data duplication and high storage cost |

---

## 💡 Key Takeaway
Use **Spectrum for scalability, Redshift for speed** — this hybrid layering gives you both agility and performance in modern analytical architectures.

<a name="part-4--event-driven-component"></a>
# ⚡ Part 4 – Event-Driven Component

## 🎯 Objective
Design an event-driven mechanism where specific clickstream events (e.g., "action":"purchase") trigger an automated workflow — such as writing enriched data to another S3 bucket or sending an alert through SNS.

---

## 🧩 High-Level Architecture

flow:
1. Raw JSON clickstream events land in S3 → company-raw/clickstream/
2. S3 triggers an **Event Notification** → Amazon EventBridge rule
3. EventBridge pattern matches events containing `"action":"purchase"`
4. Matching events invoke a **Lambda function**
5. Lambda processes the event and:
   - Writes filtered “purchase” records to s3://company-purchases/
   - Or publishes a notification to SNS topic “PurchaseAlerts”

---

## 🏗️ Architecture Diagram (text sketch)
```text
[User Browser]
   ↓
Clickstream JSON
   ↓
S3 Bucket: company-raw/clickstream
   → Event Notification
      ↓
   EventBridge Rule (pattern match: "action":"purchase")
      ↓
   Lambda Function (event handler)
      ↳ Option 1: Write to s3://company-processed/purchases/
      ↳ Option 2: Publish to SNS topic "PurchaseAlerts"
      ↓
   [Downstream consumer or dashboard]
```
---

## ⚙️ EventBridge Rule Example
```text
Event Pattern JSON:
{
  "source": ["aws.s3"],
  "detail-type": ["Object Created"],
  "detail": {
    "bucket": {
      "name": ["company-raw"]
    },
    "object": {
      "key": [{"prefix": "clickstream/"}]
    }
  }
}
```
To detect only purchase events, Lambda performs filtering logic based on event content.

---

## 🧠 Lambda Function Pseudocode
```python
import json, boto3

s3 = boto3.client("s3")
sns = boto3.client("sns")

def lambda_handler(event, context):
    # Iterate through S3 put events
    for record in event["Records"]:
        bucket = record["s3"]["bucket"]["name"]
        key = record["s3"]["object"]["key"]

        # Read the S3 object
        obj = s3.get_object(Bucket=bucket, Key=key)
        data = json.loads(obj["Body"].read())

        # Check if the event type is a purchase
        if data.get("action") == "purchase":
            # Option 1: Write to S3 (purchase bucket)
            purchase_key = key.replace("clickstream/", "purchases/")
            s3.put_object(
                Bucket="company-processed",
                Key=purchase_key,
                Body=json.dumps(data)
            )

            # Option 2: Send SNS notification
            sns.publish(
                TopicArn="arn:aws:sns:us-west-2:123456789012:PurchaseAlerts",
                Message=f"Purchase event detected: {data['user_id']}"
            )

    return {"status": "processed"}
```
---

## 🧮 Scalability & Reliability Considerations

| Concern | Mitigation |
|----------|-------------|
| **Duplicate Events** | Use object ETag (hash) or DynamoDB deduplication |
| **Lambda Timeout** | Batch events or increase memory/timeout |
| **Event Loss** | Configure DLQ (Dead Letter Queue) via SQS |
| **Error Visibility** | Emit metrics and logs to CloudWatch |
| **Security** | Lambda IAM policy grants least privilege to S3 and SNS only |

---

## 🔐 Security & Governance
- EventBridge and Lambda execute within a VPC for restricted access.
- Encrypt S3 buckets using **SSE-KMS**.
- SNS topic enforces publishing only from the Lambda IAM role.
- CloudWatch Alarms trigger if Lambda errors exceed threshold.

---

## 🧠 Design Rationale
- **Serverless-first approach** → scales seamlessly with event volume.
- **Minimal operational overhead** → no EC2 or manual monitoring.
- **EventBridge decoupling** → ensures extensibility if new event types require different workflows (e.g., cart_abandonment, signup_bonus).

---

## 💡 Key Takeaway
Design event-driven pipelines around **specific business triggers** — start small (Lambda + EventBridge) and evolve toward full decoupled streaming systems only when scale demands it.

# ⚡ Part 4 – Event-Driven Component

## 🎯 Objective
Design an event-driven mechanism where specific clickstream events (e.g., "action":"purchase") trigger an automated workflow — such as writing enriched data to another S3 bucket or sending an alert through SNS.

---

## 🧩 High-Level Architecture

flow:
1. Raw JSON clickstream events land in S3 → company-raw/clickstream/
2. S3 triggers an **Event Notification** → Amazon EventBridge rule
3. EventBridge pattern matches events containing `"action":"purchase"`
4. Matching events invoke a **Lambda function**
5. Lambda processes the event and:
   - Writes filtered “purchase” records to s3://company-purchases/
   - Or publishes a notification to SNS topic “PurchaseAlerts”

---

## 🏗️ Architecture Diagram (text sketch)

```text
┌──────────────────────────┐
│   User Browser / App     │
└────────────┬─────────────┘
             │
             ▼
     [Clickstream JSON]
             │
             ▼
┌──────────────────────────┐
│ S3 Bucket: company-raw   │
│ Path: clickstream/...    │
└────────────┬─────────────┘
             │  (S3 Event Notification)
             ▼
┌──────────────────────────┐
│     EventBridge Rule     │
│  Filter: action=purchase │
└────────────┬─────────────┘
             │  (Triggers Lambda)
             ▼
┌──────────────────────────┐
│      Lambda Function     │
│  - Parses JSON payload   │
│  - Filters purchases     │
│  - Writes to S3 or SNS   │
└────────────┬─────────────┘
     ┌───────┴────────┐
     ▼                ▼
┌───────────────┐   ┌─────────────────┐
│ S3 (Processed)│   │ SNS: Alerts/Msg │
│ purchases/    │   │ PurchaseAlerts  │
└───────────────┘   └─────────────────┘
```
---

## ⚙️ EventBridge Rule Example
```text
Event Pattern JSON:
{
  "source": ["aws.s3"],
  "detail-type": ["Object Created"],
  "detail": {
    "bucket": {
      "name": ["company-raw"]
    },
    "object": {
      "key": [{"prefix": "clickstream/"}]
    }
  }
}
```
To detect only purchase events, Lambda performs filtering logic based on event content.

---

## 🧠 Lambda Function Pseudocode
```python
import json, boto3

s3 = boto3.client("s3")
sns = boto3.client("sns")

def lambda_handler(event, context):
    # Iterate through S3 put events
    for record in event["Records"]:
        bucket = record["s3"]["bucket"]["name"]
        key = record["s3"]["object"]["key"]

        # Read the S3 object
        obj = s3.get_object(Bucket=bucket, Key=key)
        data = json.loads(obj["Body"].read())

        # Check if the event type is a purchase
        if data.get("action") == "purchase":
            # Option 1: Write to S3 (purchase bucket)
            purchase_key = key.replace("clickstream/", "purchases/")
            s3.put_object(
                Bucket="company-processed",
                Key=purchase_key,
                Body=json.dumps(data)
            )

            # Option 2: Send SNS notification
            sns.publish(
                TopicArn="arn:aws:sns:us-west-2:123456789012:PurchaseAlerts",
                Message=f"Purchase event detected: {data['user_id']}"
            )

    return {"status": "processed"}
```
---

## 🧮 Scalability & Reliability Considerations

| Concern | Mitigation |
|----------|-------------|
| **Duplicate Events** | Use object ETag (hash) or DynamoDB deduplication |
| **Lambda Timeout** | Batch events or increase memory/timeout |
| **Event Loss** | Configure DLQ (Dead Letter Queue) via SQS |
| **Error Visibility** | Emit metrics and logs to CloudWatch |
| **Security** | Lambda IAM policy grants least privilege to S3 and SNS only |

---

## 🔐 Security & Governance
- EventBridge and Lambda execute within a VPC for restricted access.
- Encrypt S3 buckets using **SSE-KMS**.
- SNS topic enforces publishing only from the Lambda IAM role.
- CloudWatch Alarms trigger if Lambda errors exceed threshold.

---

## 🧠 Design Rationale
- **Serverless-first approach** → scales seamlessly with event volume.
- **Minimal operational overhead** → no EC2 or manual monitoring.
- **EventBridge decoupling** → ensures extensibility if new event types require different workflows (e.g., cart_abandonment, signup_bonus).

---

## 💡 Key Takeaway
Design event-driven pipelines around **specific business triggers** — start small (Lambda + EventBridge) and evolve toward full decoupled streaming systems only when scale demands it.

<a name="part-5--non-functional-considerations"></a>
# 🛡️ Part 5 – Non-Functional Considerations

## 🎯 Objective
Outline key non-functional requirements — including **security**, **cost optimization**, **data quality**, **monitoring**, and **infrastructure automation** — to ensure the clickstream pipeline is scalable, compliant, and maintainable.

---

## 🔐 Security

**IAM Roles & Access Control**
- Use least-privilege IAM roles for each component:
  - `GlueJobRole` → read from raw bucket, write to processed bucket  
  - `RedshiftRole` → read from S3 via Spectrum and access Glue Catalog  
  - `LambdaRole` → read S3 events, publish SNS alerts  
- Enable **cross-account access** via resource-based policies if needed (e.g., centralized analytics account).

**Encryption**
- **S3**: Server-Side Encryption with AWS KMS (SSE-KMS)  
  `aws:s3::company-raw` and `company-processed` encrypted with CMK.  
- **Redshift**: Enable encryption at rest + SSL in transit.  
- **Glue/Athena**: Use S3 query results encryption.

**Network & VPC**
- Place Glue jobs and Lambda functions inside a **VPC** with private subnets.  
- Use **VPC endpoints** for S3, KMS, and CloudWatch to keep traffic internal.  
- Deny all public access to S3 via bucket policies and ACL blocks.

---

## 💰 Cost Awareness

| Component | Optimization Strategy | Rationale |
|------------|-----------------------|------------|
| **S3** | Use lifecycle policies: raw → Glacier after 30 days | Reduces cold storage cost |
| **Glue** | Use job bookmarks + small worker types | Avoids reprocessing and lowers DPU cost |
| **Athena** | Partition pruning + Parquet format | Minimizes scanned data and query cost |
| **Redshift** | Use **RA3 nodes** with managed storage | Pay for what’s stored, not cluster size |
| **Reserved Instances** | 1-year commitment for predictable workloads | 30–40% cheaper than on-demand |
| **EventBridge/Lambda** | Serverless pay-per-use | Cost scales with usage, no idle compute |

---

## ✅ Data Quality

**Checks & Validations**
- Schema validation on ingestion (e.g., JSON schema or Glue job check).  
- Null handling: default empty strings for optional fields.  
- Deduplication: use `distinct()` or unique IDs (`click_id`).  
- Referential integrity: ensure every `user_id` in `fact_clicks` exists in `dim_users`.  
- Daily validation job:
  - Compare count of events in raw vs processed data.
  - Log anomalies to CloudWatch or S3 audit folder.

**Data Quality Framework (example table)**
| Layer | Validation | Example |
|--------|-------------|----------|
| Raw | Schema conformity | Missing required JSON keys |
| Transform | Null check | user_id IS NOT NULL |
| Processed | Referential integrity | Fact.user_id ∈ Dim.user_id |

---

## 📈 Monitoring & Logging

**CloudWatch**
- Log groups for Lambda, Glue, and Redshift Spectrum queries.
- Set alarms for:
  - Glue job failures
  - Lambda error rate > 1%
  - Redshift query latency or queue saturation
- Dashboard: ingestion latency, partition count, processed record volume.

**CloudTrail**
- Track all S3 object-level API calls (GET, PUT, DELETE).  
- Detect unauthorized access or data deletions.

**SNS Alerts**
- Critical job failures → SNS → Email/SMS/Slack integration.  

**Metrics Example**
| Metric | Source | Alert Threshold |
|--------|---------|-----------------|
| GlueJobFailed | CloudWatch | > 0 per day |
| LambdaErrorCount | CloudWatch | > 1 per hour |
| RedshiftCPUUtilization | Redshift | > 80% |
| S3BucketSizeBytes | CloudWatch | 20% increase/day |

---

## 🧱 Infrastructure as Code (Terraform)
```python
### HCL Outline
main.tf
    provider "aws" {
      region = "us-west-2"
    }

    resource "aws_s3_bucket" "raw" {
      bucket = "company-raw"
      lifecycle_rule {
        id      = "move-to-glacier"
        enabled = true
        transition {
          days          = 30
          storage_class = "GLACIER"
        }
      }
      server_side_encryption_configuration {
        rule {
          apply_server_side_encryption_by_default {
            sse_algorithm = "aws:kms"
          }
        }
      }
    }

    resource "aws_glue_catalog_database" "clickstream" {
      name = "clickstream_processed"
    }

    resource "aws_lambda_function" "purchase_handler" {
      function_name = "purchase-event-lambda"
      role          = aws_iam_role.lambda_exec.arn
      handler       = "lambda_function.lambda_handler"
      runtime       = "python3.11"
      s3_bucket     = "company-lambda-code"
      s3_key        = "purchase-handler.zip"
    }

    resource "aws_cloudwatch_metric_alarm" "lambda_error_alarm" {
      alarm_name          = "lambda-error-alarm"
      comparison_operator = "GreaterThanThreshold"
      evaluation_periods  = 1
      metric_name         = "Errors"
      namespace           = "AWS/Lambda"
      period              = 300
      statistic           = "Sum"
      threshold           = 1
      alarm_description   = "Alert on Lambda errors"
      alarm_actions       = [aws_sns_topic.alerts.arn]
    }
```
---

## 🧠 Design Philosophy
1. **Secure by default** → least privilege, private networking, encryption everywhere.  
2. **Cost-aware** → lifecycle policies and serverless-first design.  
3. **Observable** → everything emits metrics and logs.  
4. **Automated** → IaC controls every environment (dev, staging, prod).  

---

## 💡 Key Takeaway
Non-functional excellence is invisible until it fails — bake **security, cost control, data quality, and observability** into the design from day one, not after launch.

# 🏁 Conclusion – Clickstream Analytics Data Pipeline

The Clickstream Analytics Data Pipeline demonstrates how to design a **modern, cloud-native data platform** that balances **performance, scalability, cost, and maintainability**.

Through a modular five-part design, it converts raw, unstructured clickstream events into **actionable insights** while adhering to FAANG-level engineering standards:

1. **Robust Ingestion & Cataloging** – Well-partitioned S3 storage with Glue cataloging ensures discoverability and low-cost querying.  
2. **Efficient Transformation** – PySpark transformations convert JSON into a star schema optimized for analytical workloads.  
3. **Seamless Data Warehouse Integration** – Redshift and Spectrum provide both hot and cold data querying without duplication.  
4. **Reactive Event Handling** – EventBridge and Lambda automate workflows and deliver near-real-time alerts for business-critical actions.  
5. **Non-Functional Strengths** – Security, monitoring, cost awareness, and IaC create an enterprise-grade foundation for future scaling.

---

## 🌐 Business Impact
This architecture empowers analysts, product managers, and leadership teams to:
- Track user journeys and conversion funnels in near real time.  
- Design target: reduce time-to-insight by ~80% vs. legacy batch ETL (not yet measured).  
- Lower storage and compute costs through serverless and Parquet-based optimization.  
- Maintain high confidence in data quality, lineage, and security.

---

## 🔮 Future Enhancements
1. Integrate **Kinesis or Kafka** for real-time ingestion.  
2. Add **dbt** for transformation versioning and lineage tracking.  
3. Deploy **QuickSight or Power BI dashboards** directly on Athena/Redshift outputs.  
4. Enable **machine learning enrichment** (recommendations, churn prediction) via SageMaker or Bedrock.

---

## 💡 Final Key Takeaway
Great data architectures aren’t just pipelines — they’re **living systems** that evolve with scale, automation, and trust.  
Build for **clarity**, enforce **governance**, and optimize for **future flexibility**, not just immediate success.
