console.log("main script started");
document.write("main script started, ");
//some new comment

//document.write("initScheme started, ");
    eps=0.001;
    in1=new Stream(12,0.05);
    in2=new Stream(10,0.17);
    out1=new Stream();
    out2=new Stream(0,0);
    Streams = [in1,in2,out1,out2];
//document.write("out1:"+out1.Show())
//document.write("Streams[0]"+Streams[0].Show());
//
//Mixer(in1,in2,out1);
//document.writeln("Start mixing");
//document.write("out1:"+out1.Show());
//
//Mem(in1, 0.15, 0.95, out1, out2);
//document.writeln("Start membraning");
//document.write("out1:"+out1.Show());

s1=new Source(20,0.03);
s2=new Sink();
mx=new Mixer();
mb=new Mem(0.15,0.95);

//s2.in1=s1.out1;
//s2.in1.v=7;
//document.write("s1:"+s1.out1.Show());
//document.write("s2="+s2.in1.Show());
g=new Gainer(3);
g.in1=s1.out1;
g.calc();
document.write("s1:"+s1.out1.Show());
document.write("after gainer:v="+ g.out1.Show());

//Splitter(in1,0.2,out1,out2);
//document.write(",out1 after splitter:"+out1.Show());
//document.write(",out2 after splitter:"+out2.Show());

function Source(v,c){
    this.out1=new Stream(v,c);
    this.calc=function(){};
}
function Sink(){
    this.in1=undefined;
    this.calc=function(){};
}

function Gainer(ak){
    this.k=ak;
    this.in1=null;
    this.out1=new Stream();
    this.calc=function(){
        this.out1.v=this.k*this.in1.v;
        this.out1.c=this.k*this.in1.c;
        this.in1.v/=this.k;
        this.in1.c/=this.k;
    }
}

function Stream(v,c){
    this.v=v||0;
    this.c=c||0;
    this.selfCheck=false;
    this.Show=function(){//how to add default values?
        return "volume="+this.v+",conc="+this.c+",selfCheck:"+this.selfCheck+"; ";
    }
}

function Mixer(){
    this.in1=undefined;
    this.in2=undefined;
    this.out1=new Stream();
    this.calc=function(){
        out1.v=in1.v+in2.v;
        out1.c =(in1.v*in1.c+in2.v*in2.c)/out1.v;
        out1.selfCheck=Math.abs((in1.v*in1.c+in2.v*in2.c)-(out1.v*out1.c))<eps;
        return out1;
    }
}
function Mem(kV,kC){
    this.kV=kV;
    this.kG=kC;
    this.in1=undefined;
    this.out1=new Stream();
    this.out2=new Stream();
    this.calc=MemCalc; //(this.in1,this.kV,this.kG,this.out1,this.out2);
}

function MixerCalc(in1,in2,out1){
    out1.v=in1.v+in2.v;
    out1.c =(in1.v*in1.c+in2.v*in2.c)/out1.v;
    out1.selfCheck=Math.abs((in1.v*in1.c+in2.v*in2.c)-(out1.v*out1.c))<eps;
    return out1;
}

function SplitterCalc(in1,k,out1,out2){
    out1.v=k*in1.v;
    out2.v=in1.v-out1.v;
    out1.c=in1.c;
    out2.c=in1.c;
    out1.selfCheck=out2.selfCheck=Math.abs(in1.v*in1.c-(out1.v*out1.c+out2.v*out2.c))<eps;
}

function MemCalc(in1, kG, kc, out1, out2){//Chem.mem(m, 0.15, 0.95, p, k);
    out1.v = in1.v*kG;
    out1.c = in1.c*(1-kc);
    out2.v = in1.v*(1-kG);
    out2.c = (in1.v*in1.c-out1.v*out1.c)/out2.v;
    out1.selfCheck=out2.selfCheck=Math.abs(in1.v*in1.c-(out1.v*out1.c+out2.v*out2.c))<eps;
}
