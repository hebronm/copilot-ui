function BasicInfoForm() {
    return (
      <>
        <h3>Text, Number, Date, and Color Inputs</h3>
        <fieldset>
          <legend>Basic Info</legend>
  
          <label htmlFor="name">Text input:</label>
          <input type="text" id="name" name="name" placeholder="Enter your name" /><br /><br />
  
          <label htmlFor="email">Email input:</label>
          <input type="email" id="email" name="email" /><br /><br />
  
          <label htmlFor="password">Password input:</label>
          <input type="password" id="password" name="password" /><br /><br />
  
          <label htmlFor="tel">Phone number:</label>
          <input type="tel" id="tel" name="tel" /><br /><br />
  
          <label htmlFor="url">URL input:</label>
          <input type="url" id="url" name="url" /><br /><br />
  
          <label htmlFor="number">Number input:</label>
          <input type="number" id="number" name="quantity" min="1" max="10" /><br /><br />
  
          <label htmlFor="date">Date input:</label>
          <input type="date" id="date" name="birthdate" /><br /><br />
  
          <label htmlFor="time">Time input:</label>
          <input type="time" id="time" name="appt-time" /><br /><br />
  
          <label htmlFor="color">Pick a color:</label>
          <input type="color" id="color" name="favcolor" /><br /><br />
        </fieldset>
      </>
    );
  }
  
  function SportsAndInterests() {
    return (
      <>
        <h3>Buttons and Checks</h3>
        <fieldset>
          <legend>Radio Buttons & Checkboxes</legend>
  
          <p>Choose your favorite sport:</p>
          <input type="radio" id="basketball" name="sport" value="Basketball" />
          <label htmlFor="basketball">Basketball</label><br />
  
          <input type="radio" id="football" name="sport" value="Football" />
          <label htmlFor="football">Football</label><br /><br />
  
          <p>Select your interests:</p>
          <input type="checkbox" id="coding" name="interest" value="Coding" />
          <label htmlFor="coding">Coding</label><br />
  
          <input type="checkbox" id="music" name="interest" value="Music" />
          <label htmlFor="music">Music</label><br />
  
          <input type="checkbox" id="gaming" name="interest" value="Gaming" />
          <label htmlFor="gaming">Gaming</label><br /><br />
        </fieldset>
      </>
    );
  }
  
  function DropdownAndTextarea() {
    return (
      <>
        <h3>Select Menu/Dropdown and Multiline Text</h3>
        <fieldset>
          <legend>Select Menus and Textareas</legend>
  
          <label htmlFor="car">Choose a car:</label>
          <select id="car" name="car">
            <option value="volvo">Volvo</option>
            <option value="toyota">Toyota</option>
            <option value="honda">Honda</option>
          </select><br /><br />
  
          <label htmlFor="message">Textarea:</label><br />
          <textarea id="message" name="message" rows="4" cols="50" placeholder="Write something..."></textarea><br /><br />
        </fieldset>
      </>
    );
  }
  
  function AdvancedInputs() {
    return (
      <>
        <h3>Uploading files, slider, hidden inputs, search, and datetime input</h3>
        <fieldset>
          <legend>Advanced Inputs</legend>
  
          <label htmlFor="file">Upload a file:</label>
          <input type="file" id="file" name="file" /><br /><br />
  
          <label htmlFor="range">Volume:</label>
          <input type="range" id="range" name="volume" min="0" max="100" /><br /><br />
  
          <label htmlFor="hiddenInput">Hidden input (won't show):</label>
          <input type="hidden" id="hiddenInput" name="hiddenData" value="secretValue" /><br /><br />
  
          <label htmlFor="search">Search:</label>
          <input type="search" id="search" name="search" /><br /><br />
  
          <label htmlFor="datetime-local">Meeting date and time:</label>
          <input type="datetime-local" id="datetime-local" name="meeting" /><br /><br />
        </fieldset>
      </>
    );
  }
  
  function FormButtons() {
    return (
      <>
        <h3>Buttons (Submit, Reset, and Custom)</h3>
        <fieldset>
          <legend>Form Buttons</legend>
  
          <input type="submit" value="Submit Form" />
          <input type="reset" value="Reset Form" />
          <button type="button" onClick={() => alert("Button clicked!")}>Custom Button</button>
        </fieldset>
      </>
    );
  }
  