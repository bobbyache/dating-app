In order to load JSON into your tests, you'll need to add an entry into the `tsconfig.json file`.

```json
{
  "compileOnSave": false,
  "compilerOptions": {
    ...
    "resolveJsonModule": true,
    ...
  },
    ...
}
```
Once done, one can import JSON directly into your spec file.
```typescript
import * as testData from "../_testdata/users-and-roles.json";
```

Fetch the data 
```typescript
const data = testJsonData.default as ApiResponse<IRecentDocumentsDto>;
const testData: IRecentDocumentsDto = testJsonData['data'];
```
You may need to use your `baseUrl`: `baseUrl = environment.apiUrl;`
