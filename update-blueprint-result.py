import sys
import json

if len(sys.argv) < 4:
    print('Usage: update-blueprint-result.py <blueprint_name> <blueprint_results_file> <access_token>')
    sys.exit(1)

blueprint_name = sys.argv[1].split("/")[-1]
blueprint_results_file = sys.argv[2]
access_token = sys.argv[3]

# Get blueprint results from the arg values
def get_blueprint_results():
    f = open(blueprint_results_file)
    blueprint_results = json.load(f)
    f.close()

    return blueprint_results

# Create/Write the JSON to the blueprints static folder
def write_results_to_file(blueprint_results):
    f = open(f'./docs/blueprints/{blueprint_name}.json', 'w')
    json.dump(blueprint_results, f)
    f.close()

# Add blueprint name to blueprint index
def add_blueprint_to_index(bp_name):
    # First get the existing entries
    f = open(f'./docs/blueprints/index.json', 'r')
    blueprint_entries = json.load(f)
    f.close()
    
    # If not yet in list, write it
    if bp_name not in blueprint_entries:
        f = open(f'./docs/blueprints/index.json', 'w')
        blueprint_entries.append(bp_name)
        blueprint_entries.sort()
        json.dump(blueprint_entries, f)
        f.close()

# Main
if __name__ == '__main__':
    blueprint_results = get_blueprint_results()
    write_results_to_file(blueprint_results)
    add_blueprint_to_index(blueprint_name)
    print('Updated blueprint results')
