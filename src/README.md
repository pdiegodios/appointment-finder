# Appointment Finder

This is a simple solution for appointment manager/finder.

The solution will contain a preferred appointment selection. 

Once the inputs are populated the app will show the available timeslots for an appointment of the same duration as the requested one. 

If the requested appointment is available the Add button will become enabled and you'll be able to add your appointment to the appointment list. 

Any change in the inputs will also impact the options display in the available timeslots which will be based on proximity from requested date and should have at least enough time available to add an appointment with the same duration.

The solution is based on a very simple [Developer Challenge](#developer-challenge) which I intend to make better fun from it. There we go! 

## Run the app

No secrets here, you can find a small bunch of useful scripts to run in [package.json](../package.json).

Let's start with:
```
    npm i && npm run start
```

## Responsiveness

The solution should be usable in tablet, mobile and Desktop view. I'll keep the responsiveness work to a minimum.

## Technical solution

- Language: [React](https://react.dev/) - [Typescript](https://www.typescriptlang.org/).
- Style: [Material UI](https://mui.com/) & [Emotion styled components](https://emotion.sh/docs/styled).
- State Management: [Zustand](https://zustand-demo.pmnd.rs/)

## Out of Scope

- Internationalization: Language support and timezone management.
- Theming: Proper theming.
- BE work. 

## TODO

- Change the Type of Appointment to be more appropieated:
    ```
        type Appointment = {
            customer: Customer;
            timeSlot: TimeSlot;
            notes: string;
        }
    ```
- Introduce proper form validation with `formik` or the library of your choice.
- Build API & Save Data.
- Test Coverage: Because of the nature of the POC work I have focused on getting the WOW effect instead of the test coverage. However, this should be tackled ASAP.
    - Add automated tests.
    - Maybe think about adding Snapshot test for minor elements. At a very early stage where we intend quick changes is probably a waste of time.


### NOTES

- For simplicity it's assumed that the office hours are 8am to 5pm Mon-Fri. Public Holidays are not considered.
- Also because makes no sense to make a booking from 8:57am, I've constrained the time selection to only allow quarters.
- The State Management could be solved with `useState` and or Context. However in order to keep the main components props clean and preparing for future work (and also because is more fun) I've decided to give a crack to Zustand which I've heard of it but never had the chance to play with it. 

# Developer Challenge

### Given the starting time and duration (in minutes) of two appointments, determine whether or not they conflict. You can model the appointment however you like, but the solution should return true if they conflict, and false if they don't.

Examples:

- `[2020-01-01 06:00, 20]` and `[2020-01-01 08:00, 60]` => `false`
- `[2020-01-06 08:00, 120]` and `[2020-01-06 09:15, 15]` => `true`

# Guidelines

- Write code and tests to satisfy the problem outlined above.
- Your solution should work with the latest LTS release of NodeJS.
- Your solution should demonstrate appropriate use of modern Javascript.
- Please supply a link to your solution as a Git repository.
- Include a README file that documents your solution appropriately.