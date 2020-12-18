import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MaterialModule } from "./material-module";

@NgModule({
    declarations: [
    ],
    imports: [
        FormsModule,
        MaterialModule
    ],
    exports:[
        FormsModule,
        MaterialModule
    ],
    providers: [],
  })
  export class SharedModule { }