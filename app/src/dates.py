from datetime import date
from random import randint


def suffix(day: int) -> str:
    if 3 < day < 21:
        return "th"
    return {1: "st", 2: "nd", 3: "rd"}.get(day % 10, "th")


def display_date(value: date) -> dict:
    month_name = value.strftime("%B")
    return {
        "short": f"{month_name} {value.day}{suffix(value.day)}",
        "long": f"{month_name} {value.day}{suffix(value.day)}, {value.year}",
        "month": value.month,
        "day": value.day,
        "year": value.year,
    }


def today_display() -> dict:
    return display_date(date.today())


def random_day_display() -> dict:
    year = date.today().year
    start = date(year, 1, 1).toordinal()
    end = date(year, 12, 31).toordinal()
    return display_date(date.fromordinal(randint(start, end)))
