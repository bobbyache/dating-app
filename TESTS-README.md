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

# Testing Components

> The way in which you test components may differ in approach based on whether the component is a container/smart component or a presentational component.
> - Smart components have service dependencies and retrieve data.
> - Presentational components are used to display data and accept inputs only.
>
> Most often the component can be any where in between but a good design should always try to seperate the two.

Smart components are generally not as resusable, whereas presentational components can be easily used in different parts of the application.

## Material New CSS Classes

**Note: This project usees Bootstrap and not Material, so the following few paragraphs do not apply to this project**.

In the next few component tests, we are going to be using certain CSS classes to query the DOM and retrieve elements from it, in order to run test assertions. Some of those CSS classes have changed over the years, with newer releases of Angular Material.
All the content in the video still applies and is valid for the latest Angular. But it you are coding along and want to run the tests yourself, you should use the CSS classes on the right, instead of the ones on the left:

- mat-tab-label => mdc-tab
- mat-tab-body-active  => mat-mdc-tab-body-active
- mat-card-title  => mat-mdc-card-title

Other than the name of CSS classes, everything in the course remains valid.

## Setting up the `TestBed` from the dependencies of a parent component or module

### References

Official Angular v16 docs:
- The basics of [setting up a TestBed](https://v16.angular.io/guide/testing-components-basics#cli-generated-tests).
- Why [waitForAsync is necessary](https://v16.angular.io/guide/testing-components-scenarios#waitForAsync)
- The [Component Fixture](https://v16.angular.io/guide/testing-components-basics#componentfixture)
- [Provide service test doubles](https://v16.angular.io/guide/testing-components-scenarios#provide-service-test-doubles)
### Dependencies
- Injected services should be added to the "providers" property.
- "The declarations" property contains the component under test and all internally used components.
- Many components have directives (routing, structural) that it depends on so often one will have to import the `CommonModule`..

> Its time consuming to declare all the components so to get a quick and dirty test working without fighting too much with dependencies one can:

- Look for a shared modules that exists that imports all widely used components (such as Material components).
- Before the introduction of stand-alone components, the component under test's parent module would be a great starting import as it often contained everything needed to get the component under test created. The test can always be tweaked for performance later.

```typescript
beforeEach(() => {
  TestBed.configureTestingModule({
    import: [
      // Might already provide all the dependency modules
      ParentModule,
      // Otherwise, the Angular CommonModule might be a good starting place
      CommonModule,
      ...
    ],
    declarations: [

    ]
  });
});
```

### Compiling the Component

- `compileComponents()` will give us back a promise once the component compilation process is finished.
  - Since this is not a synchronous operation, one must wait for the Promise to return.
  - Other HTML requests may be triggered during this process to retrieve HTML templates, stylesheets, etc.
  - The only safe way is to use the `then` block to set up the rest of the test.
- Set up all your variables in the `then` block after the component has been properly compiled.

The goal is to create a component instance that is unique to each test. Do NOT share components across tests as this will introduce side effects and lead to flakey tests.

#### Component Fixture
The fixture is used to create an instance of the component and will provide much functionality to debug the component:

- `fixture.componentInstance` - Gives us access to the component instance.
- `fixture.debugElement` - Gives us access to debugging capabilities.
- `fixture.detectChanges` - Gives us the ability to manually invoke change detection.
- `fixture.nativeElement` - Gives us access to the native DOM element.

```typescript
let component: TheComponent;
let fixture: ComponentFixture<TheComponent>;

beforeEach(() => {
  TestBed.configureTestingModule({
    ...
  })
    .compileComponents()
    // Can safely start testing the component after the component has
    // asynchronously compiled.
    .then(() => {
      // At this point the component has completely compiled. Use the fixture to
      // get access to the component instance.
      fixture = TestBed.createComponent(TheComponent);
      component = fixture.componentInstance;
    });
});
```

### Setting up a component test

Start the test by creating the desired component to test without instantiating it. The test will fail, but notice you can already see some information written to the console. 

```typescript
import { NavComponent } from "./nav.component";

fdescribe('NavComponent', () => {
    let component: NavComponent;

    it('should create the component', () => {
        expect(component).toBeTruthy();
        console.log('hello world');
        console.log(component);
    });
});
```
Further update the component test by adding a test bed and a fixture. At this point the test compiling the component and will return a fixture. However, when you attempt to retrieve a component instance, the test will throw and exception.

```typescript
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NavComponent } from "./nav.component";

fdescribe('NavComponent', () => {
    let component: NavComponent;
    let fixture: ComponentFixture<NavComponent>;
    
    beforeEach(() => {
        TestBed.configureTestingModule({})
        .compileComponents()
        .then(() => {
            fixture = TestBed.createComponent(NavComponent);
            component = fixture.componentInstance;
        });
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
        console.log('hello world');
        console.log(component);
    });
});
```
In the console the error will look something like this. The `NullInjectorError` is the hint that you are not taking account of dependences that need to be injected into the component.

```
NullInjectorError: R3InjectorError(DynamicTestModule)
...
NullInjectorError: No provider for HttpClient!
```
The simplest way to get a working test that can create the component is often to simply import the parent module which usually contains all the dependencies and components required such as `HttpClientModule`.

#### `waitForAsync`

Use `beforeEach(waitForAsync(() => { ... }));` where **`waitForAsync` is critical** so that the rest of your tests don't begin running before the component has compiled and debug element, component instance, and fixture are ready to use. `compileComponents` is necessary to compile seperate template files and style sheets into your component.

```typescript
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { NavComponent } from "./nav.component";
import { AppModule } from "../app.module";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { DebugElement } from "@angular/core";

fdescribe('NavComponent', () => {
    let component: NavComponent;
    let fixture: ComponentFixture<NavComponent>;
    let el: DebugElement;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [AppModule, NoopAnimationsModule],
        })
        .compileComponents()
        .then(() => {
            fixture = TestBed.createComponent(NavComponent);
            component = fixture.componentInstance;
            el = fixture.debugElement;
        });
    }));

    it('should create the component', () => {
        expect(component).toBeTruthy();
        console.log('hello world');
        console.log(component);
    });
});
```

> Not at this stage quite sure why the `AccountsService` is not required in a `providers` property. It may be that because it is injected in the root that its always available. The `ToastrService` and `Router` are provided through the `AppModule`.

### Manually building up the fine grained dependencies.

Remove all the imports for now. You'll end up with the following error when you try and run your test in the console.

```
Failed: Uncaught (in promise): NullInjectorError: R3InjectorError(DynamicTestModule)[AccountsService -> HttpClient -> HttpClient]: 
  NullInjectorError: No provider for HttpClient!
...
```
The second line is often the most useful one. Here it seems we have no provider for HttpClient. Lets add this dependency. Your test harness should now look something like this...

```typescript
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { NavComponent } from "./nav.component";
import { AppModule } from "../app.module";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { DebugElement } from "@angular/core";

fdescribe('NavComponent', () => {
    let component: NavComponent;
    let fixture: ComponentFixture<NavComponent>;
    let el: DebugElement;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientModule],
        })
        .compileComponents()
        .then(() => {
            fixture = TestBed.createComponent(NavComponent);
            component = fixture.componentInstance;
            el = fixture.debugElement;
        });
    }));

    it('should create the component', () => {
        expect(component).toBeTruthy();
        console.log('hello world');
        console.log(component);
    });
});
```

That error has gone away. We're injecting an HttpClient. Now its another one.

```
Failed: Uncaught (in promise): NullInjectorError: R3InjectorError(DynamicTestModule)[ToastrService -> InjectionToken ToastConfig -> InjectionToken ToastConfig]: 
  NullInjectorError: No provider for InjectionToken ToastConfig!
...
```
Looks as if we're not injecting the ToastrService. Notice that the second line alos mentions a ToastConfig. Now in the `SharedModule` note that we added the following to the imports property.

```typescript
  ToastrModule.forRoot({
      positionClass: 'toast-bottom-right',
  }),
```
Now we get another error. What's interesting about this error is that it feels very "Angularish". There's mention of a pipe. Particularly the mention of the `async` pipe.

```
Failed: Uncaught (in promise): Error: NG0302: The pipe 'async' could not be found in the 'NavComponent' component. Verify that it is declared or imported in this module. Find more at https://angular.io/errors/NG0302
Error: NG0302: The pipe 'async' could not be found in the 'NavComponent' component. Verify that it is declared or imported in this module. Find more at 
```

This is a tricky one. One might decide to import `CommonModule` or `BrowserModule` but the result will come back the same. The answer is that we are not declaring our component under test. Add the `NavComponent` to the declarations property of the `TestBed` and the problem goes away.

```typescript
  declarations: [
      NavComponent
  ]
```