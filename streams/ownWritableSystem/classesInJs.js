class x{
    // you can only define 1 constructor per class,
    //  so if you define multiple constructors, only the last one will be used
    
    // use optional parameters to simulate multiple constructors
    //Writing = {} (object) is simply a safety net so your code never crashes when someone leaves out the optional settings!
    constructor(x,Writing = {}){
        // you must call super() before you can use 'this' in the constructor of a subclass
        super();
    // add your variables here (created on the fly when the class is instantiated)
    this.x = x;
    this.y = Writing.y || 0;
    }
    // no need for functions to add return types
}