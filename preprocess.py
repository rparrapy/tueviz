#!/usr/bin/env python
import json
from pprint import pprint
from fuzzywuzzy import fuzz
import csv
from sets import Set

exceptions = ['Hypoparathyroidism', 'Hypoalphalipoproteinemia',
    'Hypobetalipoproteinemia', 'Hyperparathyroidism', 'Frasier syndrome',
    'MASS syndrome', 'Spondyloepiphyseal dysplasia']

exceptions2 = ['Craniofacial anomalies, empty sella turcica, corneal endothelial changes, and abnormal retinal and auditory bipolar cells']

names = []
with open('diseasome.csv', 'r') as file:
    reader = csv.reader(file)
    rownum = 0
    for row in reader:
        if rownum > 0:
            names.append(row[1])
        rownum += 1

# pprint(names)
result = []

with open('app/diseases.orig.json', 'r') as file:
    content = json.load(file)
    for d in content:
        mx = 0
        partial = ''
        for name in names:
            score = fuzz.ratio(d['disease'].replace('_', ' '), name)
            if d['disease'] in exceptions2 and mx == 0:
                mx = 100
                partial = d['disease']
            if (score >= 90 and name not in exceptions) or d['disease'].replace('_', ' ').lower() == name.lower():
                if score > mx:
                    mx = score
                    partial = name
        if mx > 90:
            # if partial == 'Spondyloepiphyseal dysplasia':
            #    print 'matching ' + d['disease'] + ' with ' + partial
            d['disease'] = partial
            result.append(d)


test = [d['disease'] for d in result]
missing = [n for n in names if n not in test]
kore = [n for n in names if n in test]

# print len(test)
# print len(kore)
# print len(names)
# pprint(missing)

#some duplicates, leave for now
d = [x for x in test if test.count(x) > 1]
# pprint(d)

print json.dumps(result, indent=4)
