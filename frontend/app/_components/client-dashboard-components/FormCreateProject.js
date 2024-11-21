function FormCreateProject() {
  return (
    <div className="scale-[1.01]  text-primary-300 w-11/12 h-full">
      <div className="bg-primary-800 text-primary-300 px-16 py-2 flex justify-between items-center">
        <p>Logged in as</p>
      </div>

      <form className="bg-primary-900 py-10 px-16 text-lg flex gap-5 flex-col">
        <div className="space-y-2">
          <label htmlFor="title">
            What is your project title?
          </label>
          <input className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm" />
        </div>
        <div className="space-y-2">
          <label htmlFor="budget">
            How much is your budget?
          </label>
          <input className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm" />
        </div>
        <div className="space-y-2">
          <label htmlFor="startDate">
            when do you want to start?
          </label>
          <input className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm" />
        </div>
        <div className="space-y-2">
          <label htmlFor="startDate">Deadline</label>
          <input className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm" />
        </div>

        <div className="space-y-2">
          <label htmlFor="endDate">
            when do you exoecte to finish this project?
          </label>
          <select
            name="numGuests"
            id="numGuests"
            className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm"
            required
          >
            <option>Select your project status</option>

            <option>Pending</option>
            <option>In Progress</option>
            <option>Completed</option>
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="observations">
            Anything we should know about your project?
          </label>
          <textarea
            name="description"
            id="description"
            className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm"
            placeholder="description, special requirements, etc.?"
          />
        </div>

        <div className="flex justify-end items-center gap-6">
          <p className="text-primary-300 text-base">
            press boutton and create a new project
          </p>

          <button className="bg-accent-500 px-8 py-4 text-primary-800 font-semibold hover:bg-accent-600 transition-all disabled:cursor-not-allowed disabled:bg-gray-500 disabled:text-gray-300">
            Create now
          </button>
        </div>
      </form>
    </div>
  );
}

export default FormCreateProject;
