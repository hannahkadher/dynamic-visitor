// src/dto/form/form-template-data.interface.ts
/**
 * Interface representing a field in a form template.
 */
export interface FormField {
    /**
     * The name of the form field.
     */
    name: string;

    /**
     * The type of the form field (e.g., 'string', 'number', 'boolean', 'array').
     */
    type: string;

    /**
     * Indicates whether the form field is required.
     */
    required: boolean;
}

/**
 * Interface representing the data for creating a form template.
 */
export interface FormTemplateData {
    /**
     * The name of the form template.
     */
    name: string;

    /**
     * An array of form fields that define the structure of the form.
     */
    fields: FormField[];
}
