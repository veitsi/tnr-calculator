document.write("main script started, ");
document.write("initScheme started, ");
    eps=0.001;
    in1=new Stream(12,0.05);
    in2=new Stream(10,0.17);
    in3=new Stream(); document.write("in3:"+in3.Show());
    out1=new Stream();
    out2=new Stream(0,0);
    Streams = [in1,in2,out1,out2];

s1=new Source(14,0.08);
mx=new Mixer(20);
mb=new Mem(0.15,0.95);
s2=new Sink();

mx.in1=s1.out1;
mx.in2=mb.out2;
mb.in1=mx.out1;
s2.in1=mb.out1;

for (int i=0;i<10;i++){
    mx.calc();
    mb.calc();
}

function Source(v,c){
    this.out1=new Stream(v,c);
    this.calc=function(){};
}
function Sink(){
    this.in1=undefined;
    this.calc=function(){};
}

function Gainer(k){
    this.k=k;
    this.in1=null;
    this.out1=new Stream();
    this.calc=function(){
        this.out1.v=this.k*this.in1.v;
        this.out1.c=this.k*this.in1.c;
        this.in1.v/=this.k;
        this.in1.c/=this.k;
        this.selfCheck=false;
    }
}

function Stream(v,c){
    this.v=v||null;
    this.c=c||null;
    this.selfCheck=false;
    this.Show=function(){//how to add default values?
        return "volume="+this.v+",conc="+this.c+",selfCheck:"+this.selfCheck+"; ";
    }
}

function Mixer(fixedV){
    this.in1=null;
    this.in2=null;
    this.out1=new Stream();
    this.calc=function(){
        this.out1.v=fixedV||this.in1.v+this.in2.v;
        this.in2.v=this.in1.v||this.out1.v/3;
        this.in2.c=this.in2.c||3*this.in1.c;
        this.in1.v=this.out1.v-this.in2.v;
        this.out1.c =(this.in1.v*this.in1.c+this.in2.v*this.in2.c)/this.out1.v;
        this.out1.selfCheck=Math.abs
        ((this.in1.v*this.in1.c+this.in2.v*this.in2.c)-(this.out1.v*this.out1.c))<eps;
    }
}
function Mem(kV,kC) {
    this.kv = kV||0.15;
    this.kc = kC||0.95;
    this.in1 = null;
    this.out1 = new Stream();
    this.out2 = new Stream();
    this.calc = function () {
        this.out1.v = this.in1.v * this.kv;
        this.out1.c = this.in1.c * (1 - this.kc);
        this.out2.v = this.in1.v * (1 - this.kv);
        this.out2.c = (this.in1.v * this.in1.c - this.out1.v * this.out1.c) / this.out2.v;
        this.out1.selfCheck = out2.selfCheck = Math.abs
        (in1.v * in1.c - (out1.v * out1.c + out2.v * out2.c)) < eps;

    }
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
