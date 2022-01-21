def index_by(items, key_getter):
    res = {}
    if isinstance(key_getter, str):
        key_getter_as_str = key_getter
        key_getter = lambda dict: dict[key_getter_as_str]
    for item in items:
        res[key_getter(item)] = item
    return res


def bucket_by(items, key_getter):
    res = {}
    if isinstance(key_getter, str):
        key_getter_as_str = key_getter
        key_getter = lambda dict: dict[key_getter_as_str]
    for item in items:
        key = key_getter(item)
        key_items = res.setdefault(key, [])
        key_items.append(item)
    return res

def flatten(list_of_lists):
    return [item for sublist in list_of_lists for item in sublist]

def get_ranges_of_same_value(items_dict):
    current_value = None
    current_keys = None
    sorted_items = sorted(items_dict.items(), key=lambda item: item[0])
    for key, value in sorted_items:
        if value == current_value:
            current_keys.append(key)
        else:
            if current_keys:
                yield current_keys, current_value
            current_keys = [key]
            current_value = value
    if len(current_keys) > 0:
        yield current_keys, current_value


def get_date_ranges_of_same_value(items_dict):
    for dates, value in get_ranges_of_same_value(items_dict):
        min_date = min(dates)
        max_date = max(dates)
        yield (min_date, max_date), value