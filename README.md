# zeltaLabs
## Data selection
In the realm of trading, the selection of an appropriate time frame is a delicate consideration. Through an exploration of temporal intervals, the 6-hour increments proved too broad, fleeting moments (3, 5 minutes) lacked depth, and higher frequencies (2, 4 hours) presented a scattered view of the market.The optimal compromise emerged at the 1-hour mark, striking a balance between granularity and data richness. This time frame allowed for a nuanced understanding of market dynamics, facilitating the formulation of effective trading strategies. For traders, the choice of timeframe is an ongoing quest to capture the essence of market movements without losing sight of the broader context—a meticulous calibration of temporal perspective to navigate the intricacies of financial landscapes.
## EDA
We started with calculation of the correlation with the features of the data and then we moved on to plotting the heatmap between the values obtained. We observed very high correlation among Open, High, Low and Close data.

### A seasonal decomposition plot slices time series data into trend, seasonality, and noise:-

1. Trend: This represents the long-term, underlying direction of the data, capturing sustained increases or decreases over time. Imagine it as the smooth, overarching curve guiding the data's overall trajectory.
2. Seasonality: This refers to recurring patterns within specific periods, like daily, weekly, monthly, or yearly cycles. Think of it as predictable fluctuations that repeat at regular intervals, influencing the data's behaviour within these cycles.
3. Noise: These are the remaining "wiggles" in the data, encompassing irregular variations not explained by the trend or seasonality. They can be due to random events, measurement errors, or other unpredictable factors.

## Feature Engineering
For training the Machine Learning Models we created lag features starting from the lag 1 till lag 24. Since we trained the models on 1 Hour timeframe data, we found that the last 1 day of values were highly correlated and thus we choose to use 24 period lag
## ML model training
1.LSTM - RMSE achieved : 618.8062
2.Random Forest - RMSE achieved : 1107.1095
3.FB Prophet - RMSE achieved : 599.8186
4.XG Boost - RMSE achieved : 1450.66
5.GRU - RMSE achieved : 618.89
## Model selection
We got the best results from LSTM, FB Prophet, and Random Forest. Each of these models excels in different areas: LSTM captured temporal dependencies, Prophet identified long-term trends, and Random Forest unravelled hidden data relationships. In order to create a robust model which can perform with greater accuracy on the data, we combined their forecasts via averaging, achieving a significant RMSE reduction to . This success stems from:
● Diversity: Each model's unique approach mitigates individual biases, creating a more robust picture.
● Ensemble averaging: It smooths individual predictions, yielding a more reliable overall forecast.
**Final RMSE: 807.628**
## Trading Strategy
This strategy combines two popular indicators (EMA crossover and RSI/MACD) for a
more robust entry and exit decision-making process.
### EMA Crossover:
● We utilise two Exponential Moving Averages (EMAs) with different timeframes.
● A fast EMA (5-period) reacts quickly to price changes, indicating short-term momentum.
● A slow EMA ( 75-period) acts as a trend indicator, offering bigger picture direction.
● Buy Signal: When the fast EMA crosses above the slow EMA from below, it suggests a potential trend reversal to the upside.
● Sell Signal: Conversely, when the fast EMA crosses below the slow EMA, it indicates a possible downtrend.
### MACD and RSI Confirmation:
● The Moving Average Convergence Divergence (MACD) assesses trend strength and potential reversals.
● The Moving Average Convergence Divergence (MACD) assesses trend strength and potential reversals
● Buy Confirmation:the MACD line crosses above the signal line, suggesting stronger bullish momentum.
● Sell Confirmation: MACD line crossing below the signal line adds confirmation to the bearish trend.
● The Relative Strength Index (RSI) measures price momentum and identifies overbought/oversold conditions.
● We define overbought and oversold thresholds ( 72 and 23, respectively).
● A neutral zone around 50 signifies balanced momentum.
● Buy Confirmation: If the fast MACD generates a buy signal, we only confirm it if the RSI is in the oversold zone. A value below 23 gives confidence in the upward trend.
● Sell Confirmation: Similarly, for a sell signal from the MACD , we require the RSI to be above 72 ;ie. Overbought to confirm the downtrend.
## Risk Management
### Stop loss
A stop-loss order is a crucial tool for risk management in trading. It automatically closes your position when the price moves against you to a predetermined level, limiting your potential losses.
**Long Positions:**
● Calculate the Risk Percentage: Decide on your acceptable risk percentage per trade. For example, if you're willing to risk 2% on a $100 stock purchase, your risk amount would be $2.
● Convert to Price Difference: Divide the risk amount by the number of shares purchased. In this case, $2 / 100 shares = $0.02 per share.
● Subtract from Entry Price: Subtract the price difference from your entry price to find the stop-loss trigger point. With a $50 entry price, the stop-loss would be set at $50 - $0.02 = $49.98.
**For Short Positions:**
● Calculate the Risk Percentage: Same as for long positions.
● Convert to Price Difference: Again, divide the risk amount by the number of shares sold short.
● Add to Entry Price: Add the price difference to your entry price (which is negative for short positions). For example, a $50 short position with a 2% risk would trigger a buy-to-close order at $50 + $0.02 = $50.02.
**Pros:**
● Captures profits during trends
● protects against pullbacks.
**Cons:**
● Requires accurate identification of support/resistance
● susceptible to false breakouts.
