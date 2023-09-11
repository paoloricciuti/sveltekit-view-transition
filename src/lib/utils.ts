export class SetOfCallback<
	T,
	S extends { listener: (props: T) => void | Promise<void>; auto_clean: boolean } = {
		listener: (props: T) => void | Promise<void>;
		auto_clean: boolean;
	},
> extends Set<S> {}
