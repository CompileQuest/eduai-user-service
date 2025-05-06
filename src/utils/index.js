import util from "util";
import UserRoles from "supertokens-node/recipe/userroles";
import { UserRoleClaim, PermissionClaim } from "supertokens-node/recipe/userroles";
import SessionContainer from "supertokens-node/recipe/session"

/**
 * Extracts and transforms form fields from the user context.
 * @param {Object} userContext - The user context object from the SuperTokens request.
 * @returns {Object|null} - A key-value object of form fields or null if not found.
 */
function extractFormFields(userContext) {
  try {
    const formFields = userContext?._default?.request?.parsedJSONBody?.formFields;
    if (formFields && Array.isArray(formFields)) {
      return formFields.reduce((acc, field) => {
        acc[field.id] = field.value;
        return acc;
      }, {});
    }
    return null; // Return null if formFields are not found
  } catch (error) {
    console.error("Error extracting form fields:", error);
    return null;
  }
}



function FormateData(data) {
  if (data) {
    return { data };
  } else {
    throw new Error("Data Not found!");
  }
};

// Granular helper function to create event payload with flexible data
function createPayloadWithEvent(event, data = {}) {
  // Dynamically determine event if not provided
  const derivedEvent = event || "no_event";
  // Construct and return the payload with dynamic data
  const payload = {
    event: derivedEvent,
    data: { ...data }  // Spread the provided data into the payload
  };
  //const formatedData = FormateData(payload);
  return payload;
}



export {
  extractFormFields,
  FormateData,
  createPayloadWithEvent,
}



