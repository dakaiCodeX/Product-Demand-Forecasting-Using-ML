# Demand Forecasting using Machine Learning


Demand forecasting is the process of making estimations about future customer demand over a defined period, using historical data and other information. 

Usually organisations follow tranditional forecasting techniques/algorithms such as Auto Arima, Auto Arima, Sarima, Simple moving average and many more.

## Table of Contents

- [Goal](#goal)
- [Workflow](#workflow)
- [Required Packages](#require)


## Goal <a name = "goal"></a>

Due to the recent boost in AI world, companies have started researching the possibility of using machine learning in place of tranditional approach.

Tuning traditional algorithms takes a significant amount of effords and domain expertise as well. 

In this repo, we are trying to figure out a way of predict the same using machine learning algorithms. 


## Data <a name = "dataset"></a>

The dataset comprised of units sold on a daily basis along with details regarding the sales, eg. SKU(product id), Store, price etc.

*record_ID,	week,	store_id,	sku_id,	total_price,	base_price,	is_featured_sku,	is_display_sku,	units_sold*


## Workflow <a name = "workflow"></a>

- Handling missing values
- Feature selection based on my previous experience in Supply chain domain
- Converting dataset into time series format to apply supervised learning approach.
- Regression Modeling
  - Random Forest
  - XGBoost
  - SVM (future scope)
- Hyperparameter Tuning

## Result
![train](https://github.com/shreyas-jk/Demand-Forecasting-Using-ML/blob/main/final.png?raw=true)



## Required Packages <a name = "require"></a>

- numpy
- pandas
- sklearn
- easypreprocessing 
- seaborn 
- matplotlib
- xgboost


## Enterprise Demand Planning Blueprint (Penti)

This repository now includes a productized planning blueprint page in the UI (`/dashboard/master-plan`) to align demand forecasting, replenishment and production planning teams.

### Target Operating Model

1. **Data Foundation**: POS, ERP, WMS, promotion and pricing data aligned in one model.
2. **MLOps Layer**: Feature store, model registry, retraining pipeline and monitoring.
3. **Forecast Layer**: Hierarchical demand forecasts by SKU/store/day and confidence intervals.
4. **Planning Layer**: Safety stock, reorder point and procurement recommendation engine.
5. **Execution Layer**: Approved plans synchronized back to planning/ERP systems.

### Suggested Delivery Phases

- **Phase 1 (0-6 weeks)**: data contracts, data quality checks, base dashboards.
- **Phase 2 (6-12 weeks)**: model benchmark, backtesting, deployment pipeline.
- **Phase 3 (12-18 weeks)**: planning automation, scenario simulator, S&OP cockpit.

### MVP in this repo

- New **Master Plan** screen with architecture map and roadmap.
- Built-in **planning calculator** for safety stock / reorder point prototyping.


## Run locally (Master Plan page)

If you could not open `http://127.0.0.1:4173/dashboard/master-plan`, run the app with the fixed port below:

```bash
npm install
npm run dev:4173
```

Then open:

- `http://127.0.0.1:4173/`
- `http://127.0.0.1:4173/dashboard/master-plan`

If the page still falls back to Landing, ensure you are using the default **Admin** mock user (has `forecast.view`).
