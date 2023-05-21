import React, { } from 'react';
import { amountFormatter } from '../../utils/Utils';
import { IonText } from '@ionic/react';

const BarGraph: React.FC = () => {
    return (
        <><div className='flex w-auto h-14 border-black'>
            <div className='rounded-l-lg border-white border-r-[1px] bg-cyan-500 w-2/3 p-4'>
                <p className='text-white '>{amountFormatter(200)}</p>
            </div>
            <div className='rounded-r-lg border-white border-l-[1px] bg-red-400 flex-1 p-4'>
                <p className='text-white text-right'>{amountFormatter(100)}</p>
            </div>
        </div>
            <div className='flex justify-between pr-2 pl-2 pt-1'>
                <p className='text-sm text-cyan-600 '>Alacak</p>
                <p className='text-sm text-red-600 '>Borç</p>
            </div>
        </>

    );
}
export default BarGraph;



