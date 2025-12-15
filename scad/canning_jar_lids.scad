// Mason Jar Lids - Base Design
// Based on USA-standard home canning jar dimensions
// Source: Thingiverse thing:3234970

// Parameters
large_mouth = true;  // Set to false for small mouth
add_slot = false;     // Add slot for money jar

// Standard dimensions (mm)
large_mouth_diameter = 70.0;
small_mouth_diameter = 60.0;
thread_pitch = 2.5;
thread_height = 8.0;
lid_thickness = 3.0;
thread_profile_radius = 1.0;

// Select dimensions based on mouth size
jar_diameter = large_mouth ? large_mouth_diameter : small_mouth_diameter;

// Thread parameters
thread_starts = 4;  // Number of thread starts
thread_angle = 360 / thread_starts;

module thread_profile() {
    // Smooth circular thread profile
    translate([jar_diameter/2 - thread_profile_radius, 0, 0])
        circle(r=thread_profile_radius, $fn=32);
}

module lid_threads() {
    // Create threaded section
    linear_extrude(height=thread_height, twist=360*thread_starts, slices=100) {
        for(i = [0:thread_starts-1]) {
            rotate([0, 0, i * thread_angle])
                thread_profile();
        }
    }
}

module lid_base() {
    // Main lid disk
    cylinder(h=lid_thickness, d=jar_diameter, $fn=64);
}

module money_slot() {
    if (add_slot) {
        translate([0, 0, lid_thickness/2])
            cube([jar_diameter * 0.15, jar_diameter * 0.4, lid_thickness + 1], center=true);
    }
}

// Main assembly
difference() {
    union() {
        lid_base();
        translate([0, 0, lid_thickness])
            lid_threads();
    }
    money_slot();
}
