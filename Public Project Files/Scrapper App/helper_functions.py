import re

print ("Prepping functions to scrap data")


def check_element (elem):
    """
    This function checks the given element and returns its stripped text if it's not None or empty, otherwise it returns an empty string.
    """
    if elem is None: 
        return ''
    if len (elem) > 0:
        return elem.text.strip()
    else:
        return ''


def extract_hourly_or_salary_range(salary_string):
    """
    Extracts the hourly or salary range from a given salary string.

    Args:
        salary_string (str): The string containing the salary information.

    Returns:
        list: A list containing the lower and upper bounds of the annual salary range, as well as the average of the two. If no match is found, returns [0, 0, 0].

    Raises:
        None

    Examples:
        >>> extract_hourly_or_salary_range('$5000 / month - $6000 / month')
        [43800.0, 54000.0, 50200.0]
        >>> extract_hourly_or_salary_range('$10 / hr - $15 / hr')
        [5200.0, 7500.0, 6875.0]
        >>> extract_hourly_or_salary_range('$5000K / year - $6000K / year')
        [5000000.0, 6000000.0, 5500000.0]
        >>> extract_hourly_or_salary_range('Invalid salary string')
        [0, 0, 0]
    """
    monthly_match = re.search(r'\$([\d,]+(?:\.\d+)?)\s?\/\s?month\s?(?:-|to)?\s?\$?([\d,]+(?:\.\d+)?)?\s?\/\s?month', salary_string)
    hourly_match = re.search(r'\$([\d,]+(?:\.\d+)?)\s?(?:-|to)?\s?\$?([\d,]+(?:\.\d+)?)?\s?\/\s?hr', salary_string)
    salary_match = re.search(r'\$([\d,]+(?:\.\d+)?)\s?K?\s?\/\s?yr\s?(?:-|to)?\s?\$?([\d,]+(?:\.\d+)?)?\s?K?\s?\/\s?yr', salary_string)

    
    
    if monthly_match:
        monthly_lower = float(monthly_match.group(1).replace(',', ''))
        monthly_upper = float(monthly_match.group(2).replace(',', '')) if monthly_match.group(2) else monthly_lower

        annual_lower = monthly_lower * 12
        annual_upper = monthly_upper * 12

        average = (annual_lower + annual_upper) / 2

        return [annual_lower, annual_upper, average]
    
    
    elif hourly_match:
        hourly_rate_lower = float(hourly_match.group(1).replace(',', ''))
        hourly_rate_upper = float(hourly_match.group(2).replace(',', '')) if hourly_match.group(2) else hourly_rate_lower

        # Assuming 40 hours per week and 52 weeks per year
        annual_lower = hourly_rate_lower * 40 * 52
        annual_upper = hourly_rate_upper * 40 * 52

        average = (annual_lower + annual_upper) / 2

        return [annual_lower, annual_upper, average]
    elif salary_match:
        salary_lower = float(salary_match.group(1).replace(',', '')) * 1000
        salary_upper = float(salary_match.group(2).replace(',', '')) * 1000 if salary_match.group(2) else salary_lower

        average = (salary_lower + salary_upper) / 2

        return [salary_lower, salary_upper, average]
    else:
        return [0,0,0]

# # Example usage
# strings = [
#     '$57/hr - $78/hr · Vision, +1 benefit',
#     '401(k), +6 benefits',
#     '$117K/yr - $134.2K/yr · Medical benefit',
#     '$55.1K/yr - $68.9K/yr',
#     '$70/hr - $75/hr · 401(k), +1 benefit',
#     'Starting at $40/hr',
#     '$57/hr - $78/hr · Vision, +1 benefit',
#      '$4,213/month - $6,524/month'
# ]

# for salary_string in strings:
#     result = extract_hourly_or_salary_range(salary_string)
#     if result:
#         print(f"Input: {salary_string}\nConverted Range: {result}\n")
#     else:
#         print(f"Input: {salary_string}\nUnable to extract hourly rate or salary range.\n")
