import React, { useEffect, useState } from 'react';
import { amountFormatter } from '../../utils/Utils';
import { GetAllTransactions, onGroupsChanged } from '../../utils/Users';
import { currentUser } from '../../utils/Users';

const BarGraph: React.FC = () => {

    const [oweAmount, setOweAmount] = useState(0);
    const [owesAmount, setOwesAmount] = useState(0);

    useEffect(() => {
        onGroupsChanged(() =>
            GetAllTransactions().then(transactions => {
                let newOweAmount = 0;
                let newOwesAmount = 0;

                transactions.forEach(transaction => {
                    if (transaction.owner == currentUser!.id) {
                        const amount = transaction.amount / transaction.splitters.length * (transaction.splitters.length - 1)
                        newOwesAmount += amount;
                    } else {
                        const amount = transaction.amount / transaction.splitters.length;
                        newOweAmount += amount;
                    }
                })

                setOweAmount(newOweAmount);
                setOwesAmount(newOwesAmount);
            })
        );
    }, [])

    function getRate() {
        if (oweAmount == 0 && owesAmount == 0)
            return 50;

        return (owesAmount / (oweAmount + owesAmount) * 100)
    }

    return (
        <><div className='flex w-auto h-14 border-black'>
            <div className='rounded-l-lg border-white border-r-[1px] bg-cyan-500 w-2/3  p-4' style={{ width: getRate() + "%" }}>
                <p className='text-white '>{amountFormatter(owesAmount)}</p>
            </div>
            <div className='rounded-r-lg border-white border-l-[1px] bg-red-400 flex-1 p-4'>
                <p className='text-white text-right'>{amountFormatter(oweAmount)}</p>
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



