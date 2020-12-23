import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MaterialModule } from "./material-module";
import { PrimengModule } from "./primeng-module";

@NgModule({
    declarations: [
    ],
    imports: [
        FormsModule,
        MaterialModule,
        // PrimengModule
    ],
    exports:[
        FormsModule,
        MaterialModule,
        // PrimengModule
    ],
    providers: [],
  })
  export class SharedModule { }