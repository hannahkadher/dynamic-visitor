// constants.ts

/**
 * Defines constant values related to controller routes.
 */
export class ControllerRoute {
    /**
     * Represents the route for form-related controllers.
     * Usage: ControllerRoute.FORM_ROUTE
     */
    public static readonly FORM_ROUTE = 'form';

    static ACTIONS = class {
        public static readonly CREATE_TEMPLATE_SUMMARY = "Create a dynamic form with name and fields";
        public static readonly CREATE_TEMPLATE_DESCRIPTION = "Create a dynamic form with name and fields with information such as name, type of field and required.";

        public static readonly GET_TEMPLATE_BY_ID_SUMMARY = "Retrieve a form template by id";
        public static readonly GET_TEMPLATE_BY_ID_DESCRIPTION = "Retrieve form template matching with form template id"

        public static readonly SUBMIT_FORM_DATA_SUMMARY = "Submit data to the dynamic template by id";
        public static readonly SUBMIT_FORM_DATA_DESCRIPTION = "Submit data to the dynamic form based on the fields of the template";

    }

}