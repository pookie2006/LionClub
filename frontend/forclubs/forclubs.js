function onSubmit(e) {
    const url = "https://lionclub.onrender.com/google-form-submit";
  
    Logger.log(e.namedValues); // TEMPORARY — check names
  
    const data = {
      title: e.namedValues["Event Title"][0],
      date: e.namedValues["Date"][0],
      startTime: e.namedValues["Event start time"][0],
      endTime: e.namedValues["Event end time"][0],
      location: e.namedValues["Location"][0],
      description: e.namedValues["Description"][0],
      subject: e.namedValues["Categorize your event!"][0]
    };
  
    const options = {
      method: "post",
      contentType: "application/json",
      payload: JSON.stringify(data),
      muteHttpExceptions: true
    };
  
    UrlFetchApp.fetch(url, options);
  }
  