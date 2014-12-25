package javaapplication1;

public class JavaApplication1 {

public static void main(String[] args) {

final double mpr = 1000.0;

stream v = new stream(mpr, 44);
stream p = new stream(0,0);
stream k = new stream(0,0);
stream m = new stream(0,0);
stream r = new stream(0,0);
stream s = new stream(0,0);

stream m0 = new stream(0,0);

for (int i=0;i<2000;i++) {
Chem.mixer(v, r, m);
Chem.mem(m, 0.15, 0.95, p, k);
Chem.sep(k, 0.25, r, s);

v.g=mpr-r.g;
if (Math.abs(m0.c-m.c)<0.001) break;
Chem.clone(m,m0);
}
Chem.prints("v", v);
Chem.prints("r", r);
Chem.prints("s", s);
}
}
class stream {
double g;
double c;
public stream (double vg, double vc) {
g = vg;
c = vc;
}
}

class Chem {
static void clone(stream x, stream y) {
y.g = x.g;
y.c = x.c;
}
static void mixer(stream in1, stream in2, stream out) {
out.g = in1.g + in2.g;
out.c = (in1.g*in1.c+in2.g*in2.c)/out.g;
}
static void sep(stream in, double k, stream out1, stream out2) {
out1.c = in.c;
out2.c = in.c;
out1.g = k*in.g;
out2.g = (1-k)*in.g;
}

static void mem(stream in, double kG, double kc, stream out1, stream out2){
out1.g = in.g*kG;
out1.c = in.c*(1-kc);
out2.g = in.g*(1-kG);
out2.c = (in.g*in.c-out1.g*out1.c)/out2.g;
}

static void prints(String name, stream x) {
System.out.print(name+":");
System.out.println("G="+x.g+" c="+x.c);
}

}