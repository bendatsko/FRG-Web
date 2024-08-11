import {useTheme} from "@/services/providers/theme-provider.tsx"; // Path to your theme context

interface DAQROCLogoProps extends React.SVGProps<SVGSVGElement> {
    height?: string;
    width?: string;
    overrideColor?: string;
}

export const DAQROCLogo: React.FC<DAQROCLogoProps> = ({
                                                          height = "30px",
                                                          width = "30px",
                                                          overrideColor,
                                                          ...props
                                                      }) => {
    const {theme} = useTheme();
    const themeColor = theme === "light" ? "black" : "white";
    const logoColor = overrideColor || themeColor;

    return (
        <svg
            id="svg"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            width={width}
            height={height}
            viewBox="0 0 400 400"
            {...props}
        >
            <g id="svgg">
                <path id="path0"
                      d="M66.540 47.997 C 65.920 48.089,65.220 48.267,64.984 48.393 C 64.748 48.520,64.056 48.697,63.444 48.788 C 62.833 48.878,61.985 49.138,61.559 49.365 C 61.133 49.592,60.633 49.784,60.448 49.793 C 60.263 49.801,59.611 50.098,59.000 50.454 C 58.389 50.810,57.589 51.266,57.222 51.468 C 56.044 52.116,53.591 54.232,52.389 55.636 C 51.747 56.386,51.108 57.100,50.967 57.222 C 50.700 57.455,48.894 60.600,48.882 60.853 C 48.878 60.934,48.629 61.500,48.328 62.111 C 48.028 62.722,47.781 63.397,47.780 63.610 C 47.779 63.824,47.553 64.624,47.278 65.388 L 46.778 66.778 46.778 92.556 C 46.778 118.286,46.779 118.336,47.255 119.889 C 47.517 120.744,47.795 121.809,47.872 122.255 C 47.949 122.702,48.149 123.180,48.316 123.319 C 48.483 123.458,48.683 123.908,48.761 124.320 C 48.838 124.731,49.048 125.125,49.228 125.194 C 49.408 125.263,49.556 125.515,49.556 125.754 C 49.556 125.993,49.806 126.485,50.111 126.848 C 50.417 127.211,50.667 127.580,50.667 127.668 C 50.667 128.091,54.677 132.444,55.067 132.444 C 55.176 132.444,55.445 132.644,55.667 132.889 C 55.888 133.133,56.191 133.333,56.341 133.333 C 56.490 133.333,56.735 133.481,56.885 133.662 C 57.035 133.843,57.422 134.124,57.746 134.288 C 58.069 134.451,58.533 134.695,58.778 134.830 C 60.221 135.624,61.607 136.222,62.007 136.222 C 62.260 136.222,62.787 136.393,63.178 136.602 C 64.493 137.303,66.693 137.375,92.000 137.541 C 117.532 137.709,119.336 137.773,120.217 138.538 C 120.403 138.700,120.921 138.898,121.367 138.978 C 121.813 139.058,122.300 139.270,122.449 139.450 C 122.599 139.630,122.844 139.778,122.994 139.778 C 123.961 139.778,129.323 144.182,130.479 145.927 C 132.177 148.487,132.760 149.482,133.109 150.413 C 133.321 150.980,133.598 151.694,133.723 152.000 C 135.182 155.550,135.011 163.831,133.433 166.084 C 133.256 166.337,133.111 166.708,133.111 166.908 C 133.111 167.109,132.917 167.520,132.680 167.821 C 132.444 168.122,132.182 168.637,132.100 168.965 C 132.018 169.293,131.836 169.635,131.697 169.725 C 131.557 169.815,131.082 170.439,130.641 171.111 C 129.108 173.448,124.800 177.077,122.856 177.671 C 122.569 177.759,122.183 177.954,122.000 178.106 C 121.817 178.258,121.168 178.503,120.559 178.652 C 119.949 178.800,119.332 179.020,119.188 179.139 C 118.565 179.657,113.677 179.770,91.853 179.774 C 72.213 179.777,68.442 179.828,66.964 180.111 C 66.006 180.294,64.922 180.449,64.556 180.454 C 64.189 180.460,63.489 180.616,63.000 180.803 C 62.511 180.989,61.761 181.232,61.333 181.343 C 60.190 181.640,58.947 182.302,56.111 184.125 C 54.806 184.964,51.426 188.404,50.533 189.803 C 49.546 191.348,47.785 194.956,47.779 195.444 C 47.777 195.689,47.553 196.539,47.282 197.333 L 46.790 198.778 46.723 263.222 C 46.645 338.827,46.543 335.583,49.126 339.778 C 49.238 339.961,49.533 340.516,49.780 341.010 C 50.806 343.067,55.253 347.717,57.000 348.562 C 57.367 348.739,58.171 349.173,58.788 349.526 C 59.404 349.878,60.222 350.236,60.606 350.320 C 60.989 350.404,61.422 350.617,61.567 350.792 C 61.713 350.968,62.070 351.111,62.360 351.111 C 62.650 351.111,63.513 351.336,64.277 351.611 L 65.667 352.111 197.333 352.111 C 303.092 352.111,329.097 352.056,329.492 351.830 C 329.762 351.675,330.662 351.409,331.492 351.239 C 332.321 351.068,333.500 350.756,334.111 350.545 C 335.109 350.202,335.685 349.965,337.556 349.128 C 337.861 348.992,338.511 348.637,339.000 348.340 C 339.489 348.044,340.112 347.699,340.384 347.574 C 343.015 346.372,348.398 340.733,350.479 337.000 C 351.226 335.660,352.222 333.568,352.222 333.340 C 352.222 333.212,352.413 332.682,352.646 332.164 C 352.879 331.646,353.133 330.777,353.211 330.233 C 353.289 329.689,353.465 329.110,353.601 328.945 C 354.418 327.960,354.430 326.140,354.424 196.333 C 354.418 63.032,354.448 67.103,353.447 64.111 C 353.002 62.781,352.278 60.965,351.924 60.288 C 351.288 59.076,350.133 57.203,349.896 57.000 C 349.754 56.878,349.212 56.256,348.692 55.617 C 347.783 54.501,344.877 51.973,343.822 51.381 C 341.958 50.334,340.842 49.778,340.603 49.778 C 340.451 49.778,339.978 49.592,339.552 49.365 C 339.126 49.138,338.299 48.881,337.714 48.795 C 337.128 48.708,336.278 48.469,335.825 48.263 C 334.927 47.856,201.653 47.590,198.889 47.990 C 197.054 48.255,194.670 48.874,193.642 49.353 C 193.140 49.586,192.610 49.778,192.464 49.778 C 192.318 49.778,191.779 49.995,191.266 50.260 C 190.753 50.525,190.221 50.800,190.085 50.871 C 186.974 52.482,181.972 57.727,181.239 60.147 C 181.159 60.411,180.948 60.748,180.769 60.896 C 180.591 61.044,180.444 61.378,180.443 61.638 C 180.442 61.898,180.243 62.411,180.000 62.778 C 179.757 63.144,179.558 63.707,179.557 64.028 C 179.556 64.348,179.381 65.048,179.167 65.583 C 178.808 66.483,178.770 68.488,178.662 92.556 L 178.546 118.556 178.051 119.868 C 177.778 120.590,177.556 121.374,177.556 121.611 C 177.556 121.847,177.356 122.295,177.111 122.606 C 176.867 122.917,176.667 123.295,176.667 123.446 C 176.667 124.079,174.627 127.262,173.045 129.095 C 172.370 129.878,170.388 131.571,169.244 132.343 C 168.012 133.173,166.998 133.788,166.667 133.905 C 166.483 133.970,165.933 134.215,165.444 134.449 C 164.956 134.684,164.156 134.971,163.667 135.089 C 163.178 135.207,162.328 135.469,161.778 135.672 C 160.360 136.196,153.363 136.062,152.289 135.490 C 151.898 135.282,151.407 135.111,151.199 135.111 C 150.788 135.111,148.988 134.337,147.222 133.401 C 145.312 132.389,142.492 130.030,141.205 128.367 C 140.529 127.493,139.853 126.628,139.704 126.444 C 138.866 125.414,137.111 121.600,137.111 120.810 C 137.111 120.603,136.911 119.864,136.667 119.169 C 136.232 117.933,136.222 117.335,136.222 92.999 C 136.222 70.767,136.184 67.951,135.863 66.769 C 135.666 66.040,135.378 64.894,135.223 64.222 C 134.815 62.449,133.351 59.143,132.756 58.649 C 132.585 58.506,132.444 58.296,132.444 58.180 C 132.444 57.449,128.348 53.224,126.333 51.878 C 124.153 50.421,121.032 49.069,118.938 48.675 C 118.294 48.553,117.544 48.327,117.272 48.171 C 116.713 47.852,68.635 47.687,66.540 47.997 M248.512 137.945 C 249.222 138.078,250.043 138.345,250.338 138.538 C 250.632 138.731,251.002 138.889,251.159 138.890 C 251.438 138.891,253.136 139.712,254.638 140.571 C 255.781 141.225,257.681 142.803,258.844 144.063 C 259.419 144.685,260.040 145.352,260.225 145.545 C 261.439 146.808,263.334 150.434,264.181 153.111 L 264.778 155.000 264.778 200.111 L 264.778 245.222 264.278 246.612 C 264.003 247.376,263.778 248.194,263.778 248.429 C 263.778 248.665,263.628 249.007,263.444 249.190 C 263.261 249.374,263.111 249.616,263.111 249.728 C 263.111 249.945,261.635 252.797,261.312 253.205 C 258.456 256.806,255.844 259.060,252.889 260.474 C 247.897 262.862,252.588 262.667,200.444 262.656 C 172.293 262.651,155.070 262.567,154.444 262.432 C 153.894 262.314,152.894 262.129,152.222 262.021 C 151.550 261.913,150.700 261.675,150.333 261.492 C 149.967 261.309,149.017 260.838,148.222 260.444 C 147.428 260.050,146.344 259.476,145.814 259.170 C 144.366 258.332,140.424 254.299,139.557 252.767 C 139.145 252.040,138.688 251.371,138.541 251.281 C 138.393 251.191,138.206 250.759,138.123 250.320 C 138.041 249.882,137.780 249.205,137.543 248.817 C 137.307 248.429,137.112 247.852,137.112 247.535 C 137.111 247.218,136.911 246.377,136.667 245.667 C 135.972 243.647,135.972 200.142,136.667 198.165 C 136.911 197.469,137.111 196.693,137.111 196.439 C 137.111 196.185,137.257 195.695,137.436 195.349 C 137.615 195.003,137.895 194.333,138.058 193.860 C 138.310 193.130,138.991 192.018,140.889 189.238 C 141.743 187.987,144.228 185.795,146.197 184.556 C 146.392 184.433,146.790 184.158,147.083 183.944 C 147.376 183.731,147.762 183.556,147.940 183.556 C 148.119 183.556,148.530 183.368,148.855 183.139 C 149.179 182.909,149.794 182.647,150.222 182.556 C 150.650 182.465,151.285 182.245,151.634 182.067 C 152.646 181.549,156.669 181.321,164.702 181.324 C 170.761 181.327,172.361 181.265,173.119 180.997 C 173.634 180.815,174.236 180.667,174.457 180.667 C 175.573 180.667,177.924 178.645,178.906 176.842 L 179.667 175.444 179.786 165.778 C 179.891 157.370,179.956 155.984,180.286 155.139 C 180.496 154.604,180.667 153.804,180.668 153.361 C 180.669 152.918,180.868 152.256,181.111 151.889 C 181.354 151.522,181.556 151.072,181.561 150.889 C 181.571 150.513,182.785 147.991,183.051 147.794 C 183.146 147.724,183.587 147.117,184.032 146.444 C 185.418 144.350,189.055 140.889,189.870 140.889 C 190.034 140.889,190.286 140.746,190.430 140.572 C 190.694 140.255,193.361 138.889,193.717 138.889 C 193.821 138.889,194.298 138.689,194.778 138.444 C 195.257 138.200,196.003 137.988,196.436 137.974 C 196.868 137.959,197.522 137.870,197.889 137.776 C 198.960 137.500,246.999 137.661,248.512 137.945 "
                      stroke="none" fill={logoColor}></path>
            </g>
        </svg>
    );
}