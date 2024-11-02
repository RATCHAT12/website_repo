import requests
from bs4 import BeautifulSoup
import pandas as pd

def scrape_website(url, output_file="scraped_data.xlsx"):
    try:
        # Send a GET request to the website
        response = requests.get(url)
        response.raise_for_status()  # Check for request errors
        
        # Parse the HTML content
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Extract text content from the webpage
        page_text = soup.get_text()

        # Save the content to an Excel file
        # Create a DataFrame to store the data
        data = {'Content': [page_text]}
        df = pd.DataFrame(data)
        
        # Write DataFrame to an Excel file
        df.to_excel(output_file, index=False)
        print(f"Data saved to {output_file}")
        
    except requests.exceptions.RequestException as e:
        print(f"Error fetching the website: {e}")

# Test the function with an example URL
if __name__ == "__main__":
    scrape_website("https://www.examtopics.com/", "scraped_data.xlsx")
