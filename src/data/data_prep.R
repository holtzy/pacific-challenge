
# Employed population by economic sector
# https://stats.pacificdata.org/vis?lc=en&df[ds]=SPC2&df[id]=DF_EMPLOYED_SECTOR&df[ag]=SPC&df[vs]=1.0&av=true&pd=%2C&dq=A...._T._T._T._T&ly[cl]=SEX&to[TIME_PERIOD]=false

# Load necessary libraries
library(readr)
library(dplyr)
library(jsonlite)

# Specify the file path
file_path <- "/Users/yanholtz/Desktop/pacific-challenge/src/data/employment_yh.csv"

# Read the CSV file
data <- read_csv(file_path)

# Select the required columns and rename them
selected_data <- data %>%
  select(`Pacific Island Countries and territories`, Sex, Urbanization, TIME_PERIOD, OBS_VALUE) %>%
  rename(island = `Pacific Island Countries and territories`)

# Convert the selected data to JSON format
json_output <- toJSON(selected_data, pretty = TRUE)

output_file_path <-  "/Users/yanholtz/Desktop/pacific-challenge/src/data/employment_yh.json"
write(json_output, output_file_path)
