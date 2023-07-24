
import React, { FormEvent, useEffect, useState } from 'react'
import { Categories } from '~/pages';
import { Checkbox } from './ui/checkbox/Checkbox';

type Props = {
    categories: Categories;
    myfunc: React.Dispatch<React.SetStateAction<Categories>>
}

const SelectCategories = ({ categories, myfunc }: Props) => {
    const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    }



    return (
        <div className='p-10'>
            <h5>
                Velg hvilke retninger du vil at kildene skal komme fra. Hvis ingen retning er valgt blir alle kildene brukt<br /> <br />
            </h5>
            <form action="" onSubmit={onSubmit} className="w-fit">


                {Object.keys(categories).map((category, index) => {
                    return (
                        <label htmlFor={category} className="flex flex-row gap-5 pb-2 justify-between" key={index}>
                            {category}
                            <Checkbox checked={categories[category]?.active} name={category} id={category} onCheckedChange={(checked) => {

                                if (checked != "indeterminate") {
                                    myfunc(prevState => ({
                                        ...prevState,
                                        [category]: { active: checked }
                                    }));
                                }

                            }}></Checkbox>
                        </label>
                    )
                }
                )
                }

            </form>
        </div>
    )
}

export default SelectCategories