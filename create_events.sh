
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImlhdCI6MTc1MTUzMjI0MCwiZXhwIjoxNzUxNjE4NjQwfQ.e20n4dthOoEjWu8bT-CpPAW3YzHesRsj855uNO
ONGSk"
 
for i in $(seq 1 20); do
  DAY=$(printf "%02d" "$i")
  curl -s -X POST http://localhost:3000/create-event \
    -H "Authorization: Bearer $TOKEN" \
    -F "event={\"address\":{\"street\":\"AutoStreet\",\"number\":$i,\"postalCode\":10115,\"city\":\"Berlin\"},\"name\":\"Auto Event #$i\",\"description\":\"Auto-generated event number $i\",\"date\":\"2025-09-${DAY}T12:00:00.000Z\",\"type\":\"private\",\"maxMembers\":5,\"visibility\":true,\"authorization\":true,\"users\":[{\"id\":1}]}" \
  && echo "→ Event #$i created"
done
