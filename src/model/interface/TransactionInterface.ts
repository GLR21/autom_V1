interface TransactionInterface<T>
{
	store(parameter:T):any;
	delete( parameter:Number ):any;
	get(parameter:any ):any;
}