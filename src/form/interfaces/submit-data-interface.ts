// Interface for the input
/**
 * Interface representing the input for submitting form data.
 */
export interface FormDataInput {
  /**
   * The ID of the form template to which the data belongs.
   */
  formTemplateId: string;

  /**
   * The form data to be submitted as key-value pairs.
   */
  formData: Record<string, any>;
}
