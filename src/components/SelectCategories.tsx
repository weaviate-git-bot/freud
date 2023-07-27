import React from "react";
import { type Categories } from "~/types/categories";
import { Checkbox } from "./ui/checkbox/Checkbox";

type Props = {
  categories: Categories;
  setCategories: React.Dispatch<React.SetStateAction<Categories>>;
};

const SelectCategories = ({ categories, setCategories }: Props) => {
  return (
    <div className="p-10">
      <h5>
        Velg hvilke retninger du vil at kildene skal komme fra. Hvis ingen
        retning er valgt blir alle kildene brukt
        <br /> <br />
      </h5>
      <form action="" className="w-fit">
        {Object.keys(categories).map((category, index) => {
          return (
            <label
              htmlFor={category}
              className="flex flex-row justify-between gap-5 pb-2"
              key={index}
            >
              {category}
              <Checkbox
                checked={categories[category]}
                name={category}
                id={category}
                onCheckedChange={(checked) => {
                  if (checked != "indeterminate") {
                    // Define new state
                    const newState = {
                      ...categories,
                      [category]: checked,
                    };

                    // Update state
                    setCategories(newState);

                    // Store state in localStorage
                    localStorage.setItem(
                      "categories",
                      JSON.stringify(newState)
                    );
                  }
                }}
              ></Checkbox>
            </label>
          );
        })}
      </form>
    </div>
  );
};

export default SelectCategories;
