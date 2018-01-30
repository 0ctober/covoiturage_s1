colls=(member adresse portion portion_standard annonce annulation villes)

echo "Import to model"
echo "~~~~~~~~~~~~~~~"
for c in ${colls[@]}
do
  echo "			[i]	$c.json"
  mongoimport -d model -c $c --file $c.json --jsonArray
done
