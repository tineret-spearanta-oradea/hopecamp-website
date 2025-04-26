### SQL to PostgREST
Use [this tool to convert the rest query to js code](https://supabase.com/docs/guides/api/sql-to-rest).

### Applying migrations locally
`supabase db reset`. Warning! This will delete the data in your db!

### SQL to Javascript
You can use this [SQL to REST API translator](https://supabase.com/docs/guides/api/sql-to-rest) to convert SQL to js code.
#### Example:
```postgresql

```

### Db tests
DB function tests are saved under `lib/supabase/database/__tests__`.
To run the tests, supabase should be started. **Running tests will delete existing db!**

You can run all the tests using `npm run test:integration`.