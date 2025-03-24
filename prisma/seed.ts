import { Permission, PrismaClient } from '@prisma/client';
import { genSalt, hash } from 'bcryptjs';
const prisma = new PrismaClient();
async function main() {
  // Define the groups and their permissions
  const groups = [
    {
      name: 'dashboard',
      permissions: ['view', 'create', 'update', 'delete'],
    },
    {
      name: 'roles',
      permissions: ['view', 'create', 'update', 'delete'],
    },
    {
      name: 'groups',
      permissions: ['view', 'create', 'update', 'delete'],
    },
    {
      name: 'permission',
      permissions: ['view', 'create', 'update', 'delete'],
    },
    {
      name: 'users',
      permissions: ['view', 'create', 'update', 'delete'],
    },
    {
      name: 'products',
      permissions: ['view', 'create', 'update', 'delete'],
    },
    {
      name: 'brand',
      permissions: ['view', 'create', 'update', 'delete'],
    },
    {
      name: 'attribute',
      permissions: ['view', 'create', 'update', 'delete'],
    },
    {
      name: 'outlet',
      permissions: ['view', 'create', 'update', 'delete'],
    },
    {
      name: 'category',
      permissions: ['view', 'create', 'update', 'delete'],
    },
    {
      name: 'uploadedFiles',
      permissions: ['view', 'create', 'update', 'delete'],
    },
    {
      name: 'banner',
      permissions: ['view', 'create', 'update', 'delete'],
    },
    {
      name: 'sideBanner',
      permissions: ['view', 'create', 'update', 'delete'],
    },
    {
      name: 'pc_builder',
      permissions: ['view', 'create', 'update', 'delete'],
    },
    {
      name: 'camera_builder',
      permissions: ['view', 'create', 'update', 'delete'],
    },
    {
      name: 'shipping',
      permissions: ['view', 'create', 'update', 'delete'],
    },
    {
      name: 'orders',
      permissions: ['view', 'create', 'update', 'delete'],
    },
    {
      name: 'unit',
      permissions: ['view', 'create', 'update', 'delete'],
    },
    {
      name: 'customer',
      permissions: ['view', 'create', 'update', 'delete'],
    },
    {
      name: 'home_seo',
      permissions: ['view', 'create', 'update', 'delete'],
    },
    {
      name: 'became_dealer',
      permissions: ['view', 'create', 'update', 'delete'],
    },
    {
      name: 'product-review',
      permissions: ['view', 'create', 'update', 'delete'],
    },
    {
      name: 'popular-search-product',
      permissions: ['view'],
    },
    {
      name: 'search-volume',
      permissions: ['view'],
    },
    {
      name: 'terms-and-conditions',
      permissions: ['view', 'update'],
    },
    {
      name: 'offers',
      permissions: ['view', 'create', 'update', 'delete'],
    },
    {
      name: 'coupon',
      permissions: ['view', 'create', 'update', 'delete'],
    },
    {
      name: 'home-banner',
      permissions: ['view', 'create', 'update', 'delete'],
    },
    {
      name: 'pixel',
      permissions: ['view', 'create', 'update', 'delete'],
    },
  ];

  // Create the groups and their permissions
  const createdPermissions: Permission[] = [];
  for (const group of groups) {
    let createdGroup = await prisma.permissionGroup.findFirst({
      where: {
        name: group.name,
      },
    });

    if (!createdGroup) {
      createdGroup = await prisma.permissionGroup.create({
        data: {
          name: group.name,
        },
      });
    }

    for (const permission of group.permissions) {
      let createdPermission = await prisma.permission.findFirst({
        where: {
          name: `${group.name}.${permission}`,
          group_id: createdGroup.id,
        },
      });

      if (!createdPermission) {
        const existingPermission = await prisma.permission.findFirst({
          where: {
            name: `${group.name}.${permission}`,
          },
        });

        if (!existingPermission) {
          createdPermission = await prisma.permission.create({
            data: {
              name: `${group.name}.${permission}`,
              group_id: createdGroup.id,
            },
          });
        } else {
          createdPermission = existingPermission;
        }
      }

      createdPermissions.push(createdPermission);
    }
  }

  // Create the user with the role and permissions
  let user = await prisma.user.findFirst({
    where: {
      email: 'super_admin@renesa.com',
    },
  });

  if (!user) {
    const existingRole = await prisma.userRole.findFirst({
      where: {
        name: 'super_admin',
      },
    });

    if (!existingRole) {
      user = await prisma.user.create({
        data: {
          email: 'super_admin@renesa.com',
          first_name: 'Mr.',
          last_name: 'Super Admin',
          mobile_number: '0123456789',
          roles: {
            create: {
              name: 'super_admin',
              permissions: {
                connect: createdPermissions.map(permission => ({
                  id: permission.id,
                })),
              },
            },
          },
          password: await hash('admin@123', await genSalt(10)),
          is_admin: true,
        },
      });
    } else {
      user = await prisma.user.create({
        data: {
          email: 'super_admin@renesa.com',
          first_name: 'Mr.',
          last_name: 'Super Admin',
          mobile_number: '0123456789',
          roles: {
            connect: {
              id: existingRole.id,
            },
          },
          password: await hash('admin@123', await genSalt(10)),
          is_admin: true,
        },
      });
    }
  }

  // create divisions

  const divisions = [
    {
      division_id: 1,
      name: 'Barishal',
      bn_name: 'বরিশাল',
      lat: 22.701002,
      long: 90.353451,
    },
    {
      division_id: 2,
      name: 'Chattogram',
      bn_name: 'চট্টগ্রাম',
      lat: 22.356851,
      long: 91.783182,
    },
    {
      division_id: 3,
      name: 'Dhaka',
      bn_name: 'ঢাকা',
      lat: 23.810332,
      long: 90.412518,
    },
    {
      division_id: 4,
      name: 'Khulna',
      bn_name: 'খুলনা',
      lat: 22.845641,
      long: 89.540328,
    },
    {
      division_id: 5,
      name: 'Rajshahi',
      bn_name: 'রাজশাহী',
      lat: 24.363589,
      long: 88.624135,
    },
    {
      division_id: 6,
      name: 'Rangpur',
      bn_name: 'রংপুর',
      lat: 25.743892,
      long: 89.275227,
    },
    {
      division_id: 7,
      name: 'Sylhet',
      bn_name: 'সিলেট',
      lat: 24.894929,
      long: 91.868706,
    },
    {
      division_id: 8,
      name: 'Mymensingh',
      bn_name: 'ময়মনসিংহ',
      lat: 24.747149,
      long: 90.420273,
    },
  ];

  for (const division of divisions) {
    const existingDivision = await prisma.divitions.findFirst({
      where: {
        division_id: division.division_id,
      },
    });

    if (!existingDivision) {
      await prisma.divitions.create({
        data: division,
      });
    }
  }

  // create districts

  const districts = [
    {
      district_id: 1,
      division_id: 3,
      name: 'Dhaka',
      bn_name: 'ঢাকা',
      lat: 23.7115253,
      long: 90.4111451,
    },
    {
      district_id: 2,
      division_id: 3,
      name: 'Faridpur',
      bn_name: 'ফরিদপুর',
      lat: 23.6070822,
      long: 89.8429406,
    },
    {
      district_id: 3,
      division_id: 3,
      name: 'Gazipur',
      bn_name: 'গাজীপুর',
      lat: 24.0022858,
      long: 90.4264283,
    },
    {
      district_id: 4,
      division_id: 3,
      name: 'Gopalganj',
      bn_name: 'গোপালগঞ্জ',
      lat: 23.0050857,
      long: 89.8266059,
    },
    {
      district_id: 5,
      division_id: 8,
      name: 'Jamalpur',
      bn_name: 'জামালপুর',
      lat: 24.937533,
      long: 89.937775,
    },
    {
      district_id: 6,
      division_id: 3,
      name: 'Kishoreganj',
      bn_name: 'কিশোরগঞ্জ',
      lat: 24.444937,
      long: 90.776575,
    },
    {
      district_id: 7,
      division_id: 3,
      name: 'Madaripur',
      bn_name: 'মাদারীপুর',
      lat: 23.164102,
      long: 90.1896805,
    },
    {
      district_id: 8,
      division_id: 3,
      name: 'Manikganj',
      bn_name: 'মানিকগঞ্জ',
      lat: 23.8644,
      long: 90.0047,
    },
    {
      district_id: 9,
      division_id: 3,
      name: 'Munshiganj',
      bn_name: 'মুন্সিগঞ্জ',
      lat: 23.5422,
      long: 90.5305,
    },
    {
      district_id: 10,
      division_id: 8,
      name: 'Mymensingh',
      bn_name: 'ময়মনসিংহ',
      lat: 24.7471,
      long: 90.4203,
    },
    {
      district_id: 11,
      division_id: 3,
      name: 'Narayanganj',
      bn_name: 'নারায়াণগঞ্জ',
      lat: 23.63366,
      long: 90.496482,
    },
    {
      district_id: 12,
      division_id: 3,
      name: 'Narsingdi',
      bn_name: 'নরসিংদী',
      lat: 23.932233,
      long: 90.71541,
    },
    {
      district_id: 13,
      division_id: 8,
      name: 'Netrokona',
      bn_name: 'নেত্রকোণা',
      lat: 24.870955,
      long: 90.727887,
    },
    {
      district_id: 14,
      division_id: 3,
      name: 'Rajbari',
      bn_name: 'রাজবাড়ি',
      lat: 23.7574305,
      long: 89.6444665,
    },
    {
      district_id: 15,
      division_id: 3,
      name: 'Shariatpur',
      bn_name: 'শরীয়তপুর',
      lat: 23.2423,
      long: 90.4348,
    },
    {
      district_id: 16,
      division_id: 8,
      name: 'Sherpur',
      bn_name: 'শেরপুর',
      lat: 25.0204933,
      long: 90.0152966,
    },
    {
      district_id: 17,
      division_id: 3,
      name: 'Tangail',
      bn_name: 'টাঙ্গাইল',
      lat: 24.2513,
      long: 89.9167,
    },
    {
      district_id: 18,
      division_id: 5,
      name: 'Bogura',
      bn_name: 'বগুড়া',
      lat: 24.8465228,
      long: 89.377755,
    },
    {
      district_id: 19,
      division_id: 5,
      name: 'Joypurhat',
      bn_name: 'জয়পুরহাট',
      lat: 25.0968,
      long: 89.0227,
    },
    {
      district_id: 20,
      division_id: 5,
      name: 'Naogaon',
      bn_name: 'নওগাঁ',
      lat: 24.7936,
      long: 88.9318,
    },
    {
      district_id: 21,
      division_id: 5,
      name: 'Natore',
      bn_name: 'নাটোর',
      lat: 24.420556,
      long: 89.000282,
    },
    {
      district_id: 22,
      division_id: 5,
      name: 'Nawabganj',
      bn_name: 'নবাবগঞ্জ',
      lat: 24.5965034,
      long: 88.2775122,
    },
    {
      district_id: 23,
      division_id: 5,
      name: 'Pabna',
      bn_name: 'পাবনা',
      lat: 23.998524,
      long: 89.233645,
    },
    {
      district_id: 24,
      division_id: 5,
      name: 'Rajshahi',
      bn_name: 'রাজশাহী',
      lat: 24.3745,
      long: 88.6042,
    },
    {
      district_id: 25,
      division_id: 5,
      name: 'Sirajgonj',
      bn_name: 'সিরাজগঞ্জ',
      lat: 24.4533978,
      long: 89.7006815,
    },
    {
      district_id: 26,
      division_id: 6,
      name: 'Dinajpur',
      bn_name: 'দিনাজপুর',
      lat: 25.6217061,
      long: 88.6354504,
    },
    {
      district_id: 27,
      division_id: 6,
      name: 'Gaibandha',
      bn_name: 'গাইবান্ধা',
      lat: 25.328751,
      long: 89.528088,
    },
    {
      district_id: 28,
      division_id: 6,
      name: 'Kurigram',
      bn_name: 'কুড়িগ্রাম',
      lat: 25.805445,
      long: 89.636174,
    },
    {
      district_id: 29,
      division_id: 6,
      name: 'Lalmonirhat',
      bn_name: 'লালমনিরহাট',
      lat: 25.9923,
      long: 89.2847,
    },
    {
      district_id: 30,
      division_id: 6,
      name: 'Nilphamari',
      bn_name: 'নীলফামারী',
      lat: 25.931794,
      long: 88.856006,
    },
    {
      district_id: 31,
      division_id: 6,
      name: 'Panchagarh',
      bn_name: 'পঞ্চগড়',
      lat: 26.3411,
      long: 88.5541606,
    },
    {
      district_id: 32,
      division_id: 6,
      name: 'Rangpur',
      bn_name: 'রংপুর',
      lat: 25.7558096,
      long: 89.244462,
    },
    {
      district_id: 33,
      division_id: 6,
      name: 'Thakurgaon',
      bn_name: 'ঠাকুরগাঁও',
      lat: 26.0336945,
      long: 88.4616834,
    },
    {
      district_id: 34,
      division_id: 1,
      name: 'Barguna',
      bn_name: 'বরগুনা',
      lat: 22.0953,
      long: 90.1121,
    },
    {
      district_id: 35,
      division_id: 1,
      name: 'Barishal',
      bn_name: 'বরিশাল',
      lat: 22.701,
      long: 90.3535,
    },
    {
      district_id: 36,
      division_id: 1,
      name: 'Bhola',
      bn_name: 'ভোলা',
      lat: 22.685923,
      long: 90.648179,
    },
    {
      district_id: 37,
      division_id: 1,
      name: 'Jhalokati',
      bn_name: 'ঝালকাঠি',
      lat: 22.6406,
      long: 90.1987,
    },
    {
      district_id: 38,
      division_id: 1,
      name: 'Patuakhali',
      bn_name: 'পটুয়াখালী',
      lat: 22.3596316,
      long: 90.3298712,
    },
    {
      district_id: 39,
      division_id: 1,
      name: 'Pirojpur',
      bn_name: 'পিরোজপুর',
      lat: 22.5841,
      long: 89.972,
    },
    {
      district_id: 40,
      division_id: 2,
      name: 'Bandarban',
      bn_name: 'বান্দরবান',
      lat: 22.1953275,
      long: 92.2183773,
    },
    {
      district_id: 41,
      division_id: 2,
      name: 'Brahmanbaria',
      bn_name: 'ব্রাহ্মণবাড়িয়া',
      lat: 23.9570904,
      long: 91.1119286,
    },
    {
      district_id: 42,
      division_id: 2,
      name: 'Chandpur',
      bn_name: 'চাঁদপুর',
      lat: 23.2332585,
      long: 90.6712912,
    },
    {
      district_id: 43,
      division_id: 2,
      name: 'Chattogram',
      bn_name: 'চট্টগ্রাম',
      lat: 22.335109,
      long: 91.834073,
    },
    {
      district_id: 44,
      division_id: 2,
      name: 'Cumilla',
      bn_name: 'কুমিল্লা',
      lat: 23.4682747,
      long: 91.1788135,
    },
    {
      district_id: 45,
      division_id: 2,
      name: "Cox's Bazar",
      bn_name: 'কক্স বাজার',
      lat: 21.4272,
      long: 92.0058,
    },
    {
      district_id: 46,
      division_id: 2,
      name: 'Feni',
      bn_name: 'ফেনী',
      lat: 23.0159,
      long: 91.3976,
    },
    {
      district_id: 47,
      division_id: 2,
      name: 'Khagrachari',
      bn_name: 'খাগড়াছড়ি',
      lat: 23.119285,
      long: 91.984663,
    },
    {
      district_id: 48,
      division_id: 2,
      name: 'Lakshmipur',
      bn_name: 'লক্ষ্মীপুর',
      lat: 22.942477,
      long: 90.841184,
    },
    {
      district_id: 49,
      division_id: 2,
      name: 'Noakhali',
      bn_name: 'নোয়াখালী',
      lat: 22.869563,
      long: 91.099398,
    },
    {
      district_id: 50,
      division_id: 2,
      name: 'Rangamati',
      bn_name: 'রাঙ্গামাটি',
      lat: 22.7324,
      long: 92.2985,
    },
    {
      district_id: 51,
      division_id: 7,
      name: 'Habiganj',
      bn_name: 'হবিগঞ্জ',
      lat: 24.374945,
      long: 91.41553,
    },
    {
      district_id: 52,
      division_id: 7,
      name: 'Maulvibazar',
      bn_name: 'মৌলভীবাজার',
      lat: 24.482934,
      long: 91.777417,
    },
    {
      district_id: 53,
      division_id: 7,
      name: 'Sunamganj',
      bn_name: 'সুনামগঞ্জ',
      lat: 25.0658042,
      long: 91.3950115,
    },
    {
      district_id: 54,
      division_id: 7,
      name: 'Sylhet',
      bn_name: 'সিলেট',
      lat: 24.8897956,
      long: 91.8697894,
    },
    {
      district_id: 55,
      division_id: 4,
      name: 'Bagerhat',
      bn_name: 'বাগেরহাট',
      lat: 22.651568,
      long: 89.785938,
    },
    {
      district_id: 56,
      division_id: 4,
      name: 'Chuadanga',
      bn_name: 'চুয়াডাঙ্গা',
      lat: 23.6401961,
      long: 88.841841,
    },
    {
      district_id: 57,
      division_id: 4,
      name: 'Jashore',
      bn_name: 'যশোর',
      lat: 23.16643,
      long: 89.2081126,
    },
    {
      district_id: 58,
      division_id: 4,
      name: 'Jhenaidah',
      bn_name: 'ঝিনাইদহ',
      lat: 23.5448176,
      long: 89.1539213,
    },
    {
      district_id: 59,
      division_id: 4,
      name: 'Khulna',
      bn_name: 'খুলনা',
      lat: 22.815774,
      long: 89.568679,
    },
    {
      district_id: 60,
      division_id: 4,
      name: 'Kushtia',
      bn_name: 'কুষ্টিয়া',
      lat: 23.901258,
      long: 89.120482,
    },
    {
      district_id: 61,
      division_id: 4,
      name: 'Magura',
      bn_name: 'মাগুরা',
      lat: 23.487337,
      long: 89.419956,
    },
    {
      district_id: 62,
      division_id: 4,
      name: 'Meherpur',
      bn_name: 'মেহেরপুর',
      lat: 23.762213,
      long: 88.631821,
    },
    {
      district_id: 63,
      division_id: 4,
      name: 'Narail',
      bn_name: 'নড়াইল',
      lat: 23.172534,
      long: 89.512672,
    },
    {
      district_id: 64,
      division_id: 4,
      name: 'Satkhira',
      bn_name: 'সাতক্ষীরা',
      lat: 22.7185,
      long: 89.0705,
    },
  ];
  for (const district of districts) {
    const existingDistrict = await prisma.districts.findFirst({
      where: {
        district_id: district.district_id,
      },
    });

    if (!existingDistrict) {
      await prisma.districts.create({
        data: district,
      });
    }
  }

  // create HomeSEO

  const defaultHomeSEO =
    '<div class="mb-5 flex items-center justify-between" style="box-sizing: border-box; border: 0px solid rgb(229, 231, 235); --tw-border-spacing-x: 0; --tw-border-spacing-y: 0; --tw-translate-x: 0; --tw-translate-y: 0; --tw-rotate: 0; --tw-skew-x: 0; --tw-skew-y: 0; --tw-scale-x: 1; --tw-scale-y: 1; --tw-pan-x: ; --tw-pan-y: ; --tw-pinch-zoom: ; --tw-scroll-snap-strictness: proximity; --tw-gradient-from-position: ; --tw-gradient-via-position: ; --tw-gradient-to-position: ; --tw-ordinal: ; --tw-slashed-zero: ; --tw-numeric-figure: ; --tw-numeric-spacing: ; --tw-numeric-fraction: ; --tw-ring-inset: ; --tw-ring-offset-width: 0px; --tw-ring-offset-color: #fff; --tw-ring-color: rgba(59,130,246,.5); --tw-ring-offset-shadow: 0 0 #0000; --tw-ring-shadow: 0 0 #0000; --tw-shadow: 0 0 #0000; --tw-shadow-colored: 0 0 #0000; --tw-blur: ; --tw-brightness: ; --tw-contrast: ; --tw-grayscale: ; --tw-hue-rotate: ; --tw-invert: ; --tw-saturate: ; --tw-sepia: ; --tw-drop-shadow: ; --tw-backdrop-blur: ; --tw-backdrop-brightness: ; --tw-backdrop-contrast: ; --tw-backdrop-grayscale: ; --tw-backdrop-hue-rotate: ; --tw-backdrop-invert: ; --tw-backdrop-opacity: ; --tw-backdrop-saturate: ; --tw-backdrop-sepia: ; --tw-contain-size: ; --tw-contain-layout: ; --tw-contain-paint: ; --tw-contain-style: ; margin-bottom: 1.25rem; display: flex; align-items: center; justify-content: space-between; color: rgb(0, 0, 0); font-family: &quot;Trebuchet MS&quot;, sans-serif; font-size: medium; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; background-color: rgb(242, 244, 248); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial;"><h2 class="section_heading_title" style="box-sizing: border-box; border: 0px solid rgb(229, 231, 235); --tw-border-spacing-x: 0; --tw-border-spacing-y: 0; --tw-translate-x: 0; --tw-translate-y: 0; --tw-rotate: 0; --tw-skew-x: 0; --tw-skew-y: 0; --tw-scale-x: 1; --tw-scale-y: 1; --tw-pan-x: ; --tw-pan-y: ; --tw-pinch-zoom: ; --tw-scroll-snap-strictness: proximity; --tw-gradient-from-position: ; --tw-gradient-via-position: ; --tw-gradient-to-position: ; --tw-ordinal: ; --tw-slashed-zero: ; --tw-numeric-figure: ; --tw-numeric-spacing: ; --tw-numeric-fraction: ; --tw-ring-inset: ; --tw-ring-offset-width: 0px; --tw-ring-offset-color: #fff; --tw-ring-color: rgba(59,130,246,.5); --tw-ring-offset-shadow: 0 0 #0000; --tw-ring-shadow: 0 0 #0000; --tw-shadow: 0 0 #0000; --tw-shadow-colored: 0 0 #0000; --tw-blur: ; --tw-brightness: ; --tw-contrast: ; --tw-grayscale: ; --tw-hue-rotate: ; --tw-invert: ; --tw-saturate: ; --tw-sepia: ; --tw-drop-shadow: ; --tw-backdrop-blur: ; --tw-backdrop-brightness: ; --tw-backdrop-contrast: ; --tw-backdrop-grayscale: ; --tw-backdrop-hue-rotate: ; --tw-backdrop-invert: ; --tw-backdrop-opacity: ; --tw-backdrop-saturate: ; --tw-backdrop-sepia: ; --tw-contain-size: ; --tw-contain-layout: ; --tw-contain-paint: ; --tw-contain-style: ; font-size: 1.125rem; font-weight: 400; margin: 25px 0px 0.75rem; line-height: 1.75rem;">Leading Computer, Laptop &amp; Gaming PC Retail &amp; Online Shop in Bangladesh</h2></div><div style="box-sizing: border-box; border: 0px solid rgb(229, 231, 235); --tw-border-spacing-x: 0; --tw-border-spacing-y: 0; --tw-translate-x: 0; --tw-translate-y: 0; --tw-rotate: 0; --tw-skew-x: 0; --tw-skew-y: 0; --tw-scale-x: 1; --tw-scale-y: 1; --tw-pan-x: ; --tw-pan-y: ; --tw-pinch-zoom: ; --tw-scroll-snap-strictness: proximity; --tw-gradient-from-position: ; --tw-gradient-via-position: ; --tw-gradient-to-position: ; --tw-ordinal: ; --tw-slashed-zero: ; --tw-numeric-figure: ; --tw-numeric-spacing: ; --tw-numeric-fraction: ; --tw-ring-inset: ; --tw-ring-offset-width: 0px; --tw-ring-offset-color: #fff; --tw-ring-color: rgba(59,130,246,.5); --tw-ring-offset-shadow: 0 0 #0000; --tw-ring-shadow: 0 0 #0000; --tw-shadow: 0 0 #0000; --tw-shadow-colored: 0 0 #0000; --tw-blur: ; --tw-brightness: ; --tw-contrast: ; --tw-grayscale: ; --tw-hue-rotate: ; --tw-invert: ; --tw-saturate: ; --tw-sepia: ; --tw-drop-shadow: ; --tw-backdrop-blur: ; --tw-backdrop-brightness: ; --tw-backdrop-contrast: ; --tw-backdrop-grayscale: ; --tw-backdrop-hue-rotate: ; --tw-backdrop-invert: ; --tw-backdrop-opacity: ; --tw-backdrop-saturate: ; --tw-backdrop-sepia: ; --tw-contain-size: ; --tw-contain-layout: ; --tw-contain-paint: ; --tw-contain-style: ; color: rgb(0, 0, 0); font-family: &quot;Trebuchet MS&quot;, sans-serif; font-size: medium; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; background-color: rgb(242, 244, 248); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial;"><p style="box-sizing: border-box; border: 0px solid rgb(229, 231, 235); --tw-border-spacing-x: 0; --tw-border-spacing-y: 0; --tw-translate-x: 0; --tw-translate-y: 0; --tw-rotate: 0; --tw-skew-x: 0; --tw-skew-y: 0; --tw-scale-x: 1; --tw-scale-y: 1; --tw-pan-x: ; --tw-pan-y: ; --tw-pinch-zoom: ; --tw-scroll-snap-strictness: proximity; --tw-gradient-from-position: ; --tw-gradient-via-position: ; --tw-gradient-to-position: ; --tw-ordinal: ; --tw-slashed-zero: ; --tw-numeric-figure: ; --tw-numeric-spacing: ; --tw-numeric-fraction: ; --tw-ring-inset: ; --tw-ring-offset-width: 0px; --tw-ring-offset-color: #fff; --tw-ring-color: rgba(59,130,246,.5); --tw-ring-offset-shadow: 0 0 #0000; --tw-ring-shadow: 0 0 #0000; --tw-shadow: 0 0 #0000; --tw-shadow-colored: 0 0 #0000; --tw-blur: ; --tw-brightness: ; --tw-contrast: ; --tw-grayscale: ; --tw-hue-rotate: ; --tw-invert: ; --tw-saturate: ; --tw-sepia: ; --tw-drop-shadow: ; --tw-backdrop-blur: ; --tw-backdrop-brightness: ; --tw-backdrop-contrast: ; --tw-backdrop-grayscale: ; --tw-backdrop-hue-rotate: ; --tw-backdrop-invert: ; --tw-backdrop-opacity: ; --tw-backdrop-saturate: ; --tw-backdrop-sepia: ; --tw-contain-size: ; --tw-contain-layout: ; --tw-contain-paint: ; --tw-contain-style: ; margin: 0px 0px 0.625rem; font-size: 15px; line-height: 26px; --tw-text-opacity: 1; color: rgb(1 19 45/var(--tw-text-opacity));">In today\'s world, technology is an integral part of our daily lives. We rely on tech products for a significant portion of our activities. In Bangladesh, it\'s rare to find a home without a tech product. That\'s where<span>&nbsp;</span><a class="text-bg-primary hover:underline" href="http://sotoboro.com/#" style="box-sizing: border-box; border: 0px solid rgb(229, 231, 235); --tw-border-spacing-x: 0; --tw-border-spacing-y: 0; --tw-translate-x: 0; --tw-translate-y: 0; --tw-rotate: 0; --tw-skew-x: 0; --tw-skew-y: 0; --tw-scale-x: 1; --tw-scale-y: 1; --tw-pan-x: ; --tw-pan-y: ; --tw-pinch-zoom: ; --tw-scroll-snap-strictness: proximity; --tw-gradient-from-position: ; --tw-gradient-via-position: ; --tw-gradient-to-position: ; --tw-ordinal: ; --tw-slashed-zero: ; --tw-numeric-figure: ; --tw-numeric-spacing: ; --tw-numeric-fraction: ; --tw-ring-inset: ; --tw-ring-offset-width: 0px; --tw-ring-offset-color: #fff; --tw-ring-color: rgba(59,130,246,.5); --tw-ring-offset-shadow: 0 0 #0000; --tw-ring-shadow: 0 0 #0000; --tw-shadow: 0 0 #0000; --tw-shadow-colored: 0 0 #0000; --tw-blur: ; --tw-brightness: ; --tw-contrast: ; --tw-grayscale: ; --tw-hue-rotate: ; --tw-invert: ; --tw-saturate: ; --tw-sepia: ; --tw-drop-shadow: ; --tw-backdrop-blur: ; --tw-backdrop-brightness: ; --tw-backdrop-contrast: ; --tw-backdrop-grayscale: ; --tw-backdrop-hue-rotate: ; --tw-backdrop-invert: ; --tw-backdrop-opacity: ; --tw-backdrop-saturate: ; --tw-backdrop-sepia: ; --tw-contain-size: ; --tw-contain-layout: ; --tw-contain-paint: ; --tw-contain-style: ; color: rgb(228 47 3/var(--tw-text-opacity)); text-decoration: inherit; --tw-text-opacity: 1;">Renesa Bazar</a><span>&nbsp;</span>comes in. Established in March 2024 as a Tech Product Shop, our focus has always been on providing the best customer service in Bangladesh, adhering to our motto, “Customer Comes First.” This commitment to customer service has made Renesa Bazar the most trusted computer shop in Bangladesh, earning the loyalty of a large customer base. After a 16-year journey, Renesa Bazar was awarded the prestigious \'ISO 9001:2015 certification\' in recognition of our superior Quality Control Management System. As an ISO-certified organization, we meet international standards for a Quality Management System (QMS), ensuring that we consistently meet regulatory requirements and deliver products and services of global standard to our customers.</p><h2 style="box-sizing: border-box; border: 0px solid rgb(229, 231, 235); --tw-border-spacing-x: 0; --tw-border-spacing-y: 0; --tw-translate-x: 0; --tw-translate-y: 0; --tw-rotate: 0; --tw-skew-x: 0; --tw-skew-y: 0; --tw-scale-x: 1; --tw-scale-y: 1; --tw-pan-x: ; --tw-pan-y: ; --tw-pinch-zoom: ; --tw-scroll-snap-strictness: proximity; --tw-gradient-from-position: ; --tw-gradient-via-position: ; --tw-gradient-to-position: ; --tw-ordinal: ; --tw-slashed-zero: ; --tw-numeric-figure: ; --tw-numeric-spacing: ; --tw-numeric-fraction: ; --tw-ring-inset: ; --tw-ring-offset-width: 0px; --tw-ring-offset-color: #fff; --tw-ring-color: rgba(59,130,246,.5); --tw-ring-offset-shadow: 0 0 #0000; --tw-ring-shadow: 0 0 #0000; --tw-shadow: 0 0 #0000; --tw-shadow-colored: 0 0 #0000; --tw-blur: ; --tw-brightness: ; --tw-contrast: ; --tw-grayscale: ; --tw-hue-rotate: ; --tw-invert: ; --tw-saturate: ; --tw-sepia: ; --tw-drop-shadow: ; --tw-backdrop-blur: ; --tw-backdrop-brightness: ; --tw-backdrop-contrast: ; --tw-backdrop-grayscale: ; --tw-backdrop-hue-rotate: ; --tw-backdrop-invert: ; --tw-backdrop-opacity: ; --tw-backdrop-saturate: ; --tw-backdrop-sepia: ; --tw-contain-size: ; --tw-contain-layout: ; --tw-contain-paint: ; --tw-contain-style: ; font-size: 1.125rem; font-weight: 400; margin: 25px 0px 0.75rem; line-height: 1.75rem;">Best Laptop Shop in Bangladesh</h2><p style="box-sizing: border-box; border: 0px solid rgb(229, 231, 235); --tw-border-spacing-x: 0; --tw-border-spacing-y: 0; --tw-translate-x: 0; --tw-translate-y: 0; --tw-rotate: 0; --tw-skew-x: 0; --tw-skew-y: 0; --tw-scale-x: 1; --tw-scale-y: 1; --tw-pan-x: ; --tw-pan-y: ; --tw-pinch-zoom: ; --tw-scroll-snap-strictness: proximity; --tw-gradient-from-position: ; --tw-gradient-via-position: ; --tw-gradient-to-position: ; --tw-ordinal: ; --tw-slashed-zero: ; --tw-numeric-figure: ; --tw-numeric-spacing: ; --tw-numeric-fraction: ; --tw-ring-inset: ; --tw-ring-offset-width: 0px; --tw-ring-offset-color: #fff; --tw-ring-color: rgba(59,130,246,.5); --tw-ring-offset-shadow: 0 0 #0000; --tw-ring-shadow: 0 0 #0000; --tw-shadow: 0 0 #0000; --tw-shadow-colored: 0 0 #0000; --tw-blur: ; --tw-brightness: ; --tw-contrast: ; --tw-grayscale: ; --tw-hue-rotate: ; --tw-invert: ; --tw-saturate: ; --tw-sepia: ; --tw-drop-shadow: ; --tw-backdrop-blur: ; --tw-backdrop-brightness: ; --tw-backdrop-contrast: ; --tw-backdrop-grayscale: ; --tw-backdrop-hue-rotate: ; --tw-backdrop-invert: ; --tw-backdrop-opacity: ; --tw-backdrop-saturate: ; --tw-backdrop-sepia: ; --tw-contain-size: ; --tw-contain-layout: ; --tw-contain-paint: ; --tw-contain-style: ; margin: 0px 0px 0.625rem; font-size: 15px; line-height: 26px; --tw-text-opacity: 1; color: rgb(1 19 45/var(--tw-text-opacity));">Renesa Bazar is the top choice for<span>&nbsp;</span><a class="text-bg-primary hover:underline" href="http://sotoboro.com/#" style="box-sizing: border-box; border: 0px solid rgb(229, 231, 235); --tw-border-spacing-x: 0; --tw-border-spacing-y: 0; --tw-translate-x: 0; --tw-translate-y: 0; --tw-rotate: 0; --tw-skew-x: 0; --tw-skew-y: 0; --tw-scale-x: 1; --tw-scale-y: 1; --tw-pan-x: ; --tw-pan-y: ; --tw-pinch-zoom: ; --tw-scroll-snap-strictness: proximity; --tw-gradient-from-position: ; --tw-gradient-via-position: ; --tw-gradient-to-position: ; --tw-ordinal: ; --tw-slashed-zero: ; --tw-numeric-figure: ; --tw-numeric-spacing: ; --tw-numeric-fraction: ; --tw-ring-inset: ; --tw-ring-offset-width: 0px; --tw-ring-offset-color: #fff; --tw-ring-color: rgba(59,130,246,.5); --tw-ring-offset-shadow: 0 0 #0000; --tw-ring-shadow: 0 0 #0000; --tw-shadow: 0 0 #0000; --tw-shadow-colored: 0 0 #0000; --tw-blur: ; --tw-brightness: ; --tw-contrast: ; --tw-grayscale: ; --tw-hue-rotate: ; --tw-invert: ; --tw-saturate: ; --tw-sepia: ; --tw-drop-shadow: ; --tw-backdrop-blur: ; --tw-backdrop-brightness: ; --tw-backdrop-contrast: ; --tw-backdrop-grayscale: ; --tw-backdrop-hue-rotate: ; --tw-backdrop-invert: ; --tw-backdrop-opacity: ; --tw-backdrop-saturate: ; --tw-backdrop-sepia: ; --tw-contain-size: ; --tw-contain-layout: ; --tw-contain-paint: ; --tw-contain-style: ; color: rgb(228 47 3/var(--tw-text-opacity)); text-decoration: inherit; --tw-text-opacity: 1;">Laptop Brand Shop in BD</a>. Whether you\'re a freelancer, office worker, or student, Renesa Bazar\'s<span>&nbsp;</span><a class="text-bg-primary hover:underline" href="http://sotoboro.com/#" style="box-sizing: border-box; border: 0px solid rgb(229, 231, 235); --tw-border-spacing-x: 0; --tw-border-spacing-y: 0; --tw-translate-x: 0; --tw-translate-y: 0; --tw-rotate: 0; --tw-skew-x: 0; --tw-skew-y: 0; --tw-scale-x: 1; --tw-scale-y: 1; --tw-pan-x: ; --tw-pan-y: ; --tw-pinch-zoom: ; --tw-scroll-snap-strictness: proximity; --tw-gradient-from-position: ; --tw-gradient-via-position: ; --tw-gradient-to-position: ; --tw-ordinal: ; --tw-slashed-zero: ; --tw-numeric-figure: ; --tw-numeric-spacing: ; --tw-numeric-fraction: ; --tw-ring-inset: ; --tw-ring-offset-width: 0px; --tw-ring-offset-color: #fff; --tw-ring-color: rgba(59,130,246,.5); --tw-ring-offset-shadow: 0 0 #0000; --tw-ring-shadow: 0 0 #0000; --tw-shadow: 0 0 #0000; --tw-shadow-colored: 0 0 #0000; --tw-blur: ; --tw-brightness: ; --tw-contrast: ; --tw-grayscale: ; --tw-hue-rotate: ; --tw-invert: ; --tw-saturate: ; --tw-sepia: ; --tw-drop-shadow: ; --tw-backdrop-blur: ; --tw-backdrop-brightness: ; --tw-backdrop-contrast: ; --tw-backdrop-grayscale: ; --tw-backdrop-hue-rotate: ; --tw-backdrop-invert: ; --tw-backdrop-opacity: ; --tw-backdrop-saturate: ; --tw-backdrop-sepia: ; --tw-contain-size: ; --tw-contain-layout: ; --tw-contain-paint: ; --tw-contain-style: ; color: rgb(228 47 3/var(--tw-text-opacity)); text-decoration: inherit; --tw-text-opacity: 1;">Laptop</a><span>&nbsp;</span>Shop has the perfect device for you. Gamers particularly appreciate our range of<span>&nbsp;</span><a class="text-bg-primary hover:underline" href="http://sotoboro.com/#" style="box-sizing: border-box; border: 0px solid rgb(229, 231, 235); --tw-border-spacing-x: 0; --tw-border-spacing-y: 0; --tw-translate-x: 0; --tw-translate-y: 0; --tw-rotate: 0; --tw-skew-x: 0; --tw-skew-y: 0; --tw-scale-x: 1; --tw-scale-y: 1; --tw-pan-x: ; --tw-pan-y: ; --tw-pinch-zoom: ; --tw-scroll-snap-strictness: proximity; --tw-gradient-from-position: ; --tw-gradient-via-position: ; --tw-gradient-to-position: ; --tw-ordinal: ; --tw-slashed-zero: ; --tw-numeric-figure: ; --tw-numeric-spacing: ; --tw-numeric-fraction: ; --tw-ring-inset: ; --tw-ring-offset-width: 0px; --tw-ring-offset-color: #fff; --tw-ring-color: rgba(59,130,246,.5); --tw-ring-offset-shadow: 0 0 #0000; --tw-ring-shadow: 0 0 #0000; --tw-shadow: 0 0 #0000; --tw-shadow-colored: 0 0 #0000; --tw-blur: ; --tw-brightness: ; --tw-contrast: ; --tw-grayscale: ; --tw-hue-rotate: ; --tw-invert: ; --tw-saturate: ; --tw-sepia: ; --tw-drop-shadow: ; --tw-backdrop-blur: ; --tw-backdrop-brightness: ; --tw-backdrop-contrast: ; --tw-backdrop-grayscale: ; --tw-backdrop-hue-rotate: ; --tw-backdrop-invert: ; --tw-backdrop-opacity: ; --tw-backdrop-saturate: ; --tw-backdrop-sepia: ; --tw-contain-size: ; --tw-contain-layout: ; --tw-contain-paint: ; --tw-contain-style: ; color: rgb(228 47 3/var(--tw-text-opacity)); text-decoration: inherit; --tw-text-opacity: 1;">Gaming Laptops</a>, as we consistently stock the latest models. As the best laptop shop in BD, we prioritize our customers\' budgets, offering the latest Intel and AMD Laptops at affordable prices. Renesa Bazar is recognized as the most trusted laptop shop in BD, offering top laptop brands from around the world. Our experts provide tailored buying advice based on your needs and budget, further solidifying Renesa Bazar\'s reputation as the most trusted laptop shop in Bangladesh. At Renesa Bazar, you can purchase an official Apple<span>&nbsp;</span><a class="text-bg-primary hover:underline" href="http://sotoboro.com/#" style="box-sizing: border-box; border: 0px solid rgb(229, 231, 235); --tw-border-spacing-x: 0; --tw-border-spacing-y: 0; --tw-translate-x: 0; --tw-translate-y: 0; --tw-rotate: 0; --tw-skew-x: 0; --tw-skew-y: 0; --tw-scale-x: 1; --tw-scale-y: 1; --tw-pan-x: ; --tw-pan-y: ; --tw-pinch-zoom: ; --tw-scroll-snap-strictness: proximity; --tw-gradient-from-position: ; --tw-gradient-via-position: ; --tw-gradient-to-position: ; --tw-ordinal: ; --tw-slashed-zero: ; --tw-numeric-figure: ; --tw-numeric-spacing: ; --tw-numeric-fraction: ; --tw-ring-inset: ; --tw-ring-offset-width: 0px; --tw-ring-offset-color: #fff; --tw-ring-color: rgba(59,130,246,.5); --tw-ring-offset-shadow: 0 0 #0000; --tw-ring-shadow: 0 0 #0000; --tw-shadow: 0 0 #0000; --tw-shadow-colored: 0 0 #0000; --tw-blur: ; --tw-brightness: ; --tw-contrast: ; --tw-grayscale: ; --tw-hue-rotate: ; --tw-invert: ; --tw-saturate: ; --tw-sepia: ; --tw-drop-shadow: ; --tw-backdrop-blur: ; --tw-backdrop-brightness: ; --tw-backdrop-contrast: ; --tw-backdrop-grayscale: ; --tw-backdrop-hue-rotate: ; --tw-backdrop-invert: ; --tw-backdrop-opacity: ; --tw-backdrop-saturate: ; --tw-backdrop-sepia: ; --tw-contain-size: ; --tw-contain-layout: ; --tw-contain-paint: ; --tw-contain-style: ; color: rgb(228 47 3/var(--tw-text-opacity)); text-decoration: inherit; --tw-text-opacity: 1;">MacBook</a><span>&nbsp;</span>Air or MacBook Pro from the<span>&nbsp;</span><a class="text-bg-primary hover:underline" href="http://sotoboro.com/#" style="box-sizing: border-box; border: 0px solid rgb(229, 231, 235); --tw-border-spacing-x: 0; --tw-border-spacing-y: 0; --tw-translate-x: 0; --tw-translate-y: 0; --tw-rotate: 0; --tw-skew-x: 0; --tw-skew-y: 0; --tw-scale-x: 1; --tw-scale-y: 1; --tw-pan-x: ; --tw-pan-y: ; --tw-pinch-zoom: ; --tw-scroll-snap-strictness: proximity; --tw-gradient-from-position: ; --tw-gradient-via-position: ; --tw-gradient-to-position: ; --tw-ordinal: ; --tw-slashed-zero: ; --tw-numeric-figure: ; --tw-numeric-spacing: ; --tw-numeric-fraction: ; --tw-ring-inset: ; --tw-ring-offset-width: 0px; --tw-ring-offset-color: #fff; --tw-ring-color: rgba(59,130,246,.5); --tw-ring-offset-shadow: 0 0 #0000; --tw-ring-shadow: 0 0 #0000; --tw-shadow: 0 0 #0000; --tw-shadow-colored: 0 0 #0000; --tw-blur: ; --tw-brightness: ; --tw-contrast: ; --tw-grayscale: ; --tw-hue-rotate: ; --tw-invert: ; --tw-saturate: ; --tw-sepia: ; --tw-drop-shadow: ; --tw-backdrop-blur: ; --tw-backdrop-brightness: ; --tw-backdrop-contrast: ; --tw-backdrop-grayscale: ; --tw-backdrop-hue-rotate: ; --tw-backdrop-invert: ; --tw-backdrop-opacity: ; --tw-backdrop-saturate: ; --tw-backdrop-sepia: ; --tw-contain-size: ; --tw-contain-layout: ; --tw-contain-paint: ; --tw-contain-style: ; color: rgb(228 47 3/var(--tw-text-opacity)); text-decoration: inherit; --tw-text-opacity: 1;">Apple Store in Bangladesh.</a>. We stock the latest models from popular laptop brands such as<span>&nbsp;</span><a class="text-bg-primary hover:underline" href="http://sotoboro.com/#" style="box-sizing: border-box; border: 0px solid rgb(229, 231, 235); --tw-border-spacing-x: 0; --tw-border-spacing-y: 0; --tw-translate-x: 0; --tw-translate-y: 0; --tw-rotate: 0; --tw-skew-x: 0; --tw-skew-y: 0; --tw-scale-x: 1; --tw-scale-y: 1; --tw-pan-x: ; --tw-pan-y: ; --tw-pinch-zoom: ; --tw-scroll-snap-strictness: proximity; --tw-gradient-from-position: ; --tw-gradient-via-position: ; --tw-gradient-to-position: ; --tw-ordinal: ; --tw-slashed-zero: ; --tw-numeric-figure: ; --tw-numeric-spacing: ; --tw-numeric-fraction: ; --tw-ring-inset: ; --tw-ring-offset-width: 0px; --tw-ring-offset-color: #fff; --tw-ring-color: rgba(59,130,246,.5); --tw-ring-offset-shadow: 0 0 #0000; --tw-ring-shadow: 0 0 #0000; --tw-shadow: 0 0 #0000; --tw-shadow-colored: 0 0 #0000; --tw-blur: ; --tw-brightness: ; --tw-contrast: ; --tw-grayscale: ; --tw-hue-rotate: ; --tw-invert: ; --tw-saturate: ; --tw-sepia: ; --tw-drop-shadow: ; --tw-backdrop-blur: ; --tw-backdrop-brightness: ; --tw-backdrop-contrast: ; --tw-backdrop-grayscale: ; --tw-backdrop-hue-rotate: ; --tw-backdrop-invert: ; --tw-backdrop-opacity: ; --tw-backdrop-saturate: ; --tw-backdrop-sepia: ; --tw-contain-size: ; --tw-contain-layout: ; --tw-contain-paint: ; --tw-contain-style: ; color: rgb(228 47 3/var(--tw-text-opacity)); text-decoration: inherit; --tw-text-opacity: 1;">Razer</a>,<span>&nbsp;</span><a class="text-bg-primary hover:underline" href="http://sotoboro.com/#" style="box-sizing: border-box; border: 0px solid rgb(229, 231, 235); --tw-border-spacing-x: 0; --tw-border-spacing-y: 0; --tw-translate-x: 0; --tw-translate-y: 0; --tw-rotate: 0; --tw-skew-x: 0; --tw-skew-y: 0; --tw-scale-x: 1; --tw-scale-y: 1; --tw-pan-x: ; --tw-pan-y: ; --tw-pinch-zoom: ; --tw-scroll-snap-strictness: proximity; --tw-gradient-from-position: ; --tw-gradient-via-position: ; --tw-gradient-to-position: ; --tw-ordinal: ; --tw-slashed-zero: ; --tw-numeric-figure: ; --tw-numeric-spacing: ; --tw-numeric-fraction: ; --tw-ring-inset: ; --tw-ring-offset-width: 0px; --tw-ring-offset-color: #fff; --tw-ring-color: rgba(59,130,246,.5); --tw-ring-offset-shadow: 0 0 #0000; --tw-ring-shadow: 0 0 #0000; --tw-shadow: 0 0 #0000; --tw-shadow-colored: 0 0 #0000; --tw-blur: ; --tw-brightness: ; --tw-contrast: ; --tw-grayscale: ; --tw-hue-rotate: ; --tw-invert: ; --tw-saturate: ; --tw-sepia: ; --tw-drop-shadow: ; --tw-backdrop-blur: ; --tw-backdrop-brightness: ; --tw-backdrop-contrast: ; --tw-backdrop-grayscale: ; --tw-backdrop-hue-rotate: ; --tw-backdrop-invert: ; --tw-backdrop-opacity: ; --tw-backdrop-saturate: ; --tw-backdrop-sepia: ; --tw-contain-size: ; --tw-contain-layout: ; --tw-contain-paint: ; --tw-contain-style: ; color: rgb(228 47 3/var(--tw-text-opacity)); text-decoration: inherit; --tw-text-opacity: 1;">Hp</a>, Dell,<span>&nbsp;</span><a class="text-bg-primary hover:underline" href="http://sotoboro.com/#" style="box-sizing: border-box; border: 0px solid rgb(229, 231, 235); --tw-border-spacing-x: 0; --tw-border-spacing-y: 0; --tw-translate-x: 0; --tw-translate-y: 0; --tw-rotate: 0; --tw-skew-x: 0; --tw-skew-y: 0; --tw-scale-x: 1; --tw-scale-y: 1; --tw-pan-x: ; --tw-pan-y: ; --tw-pinch-zoom: ; --tw-scroll-snap-strictness: proximity; --tw-gradient-from-position: ; --tw-gradient-via-position: ; --tw-gradient-to-position: ; --tw-ordinal: ; --tw-slashed-zero: ; --tw-numeric-figure: ; --tw-numeric-spacing: ; --tw-numeric-fraction: ; --tw-ring-inset: ; --tw-ring-offset-width: 0px; --tw-ring-offset-color: #fff; --tw-ring-color: rgba(59,130,246,.5); --tw-ring-offset-shadow: 0 0 #0000; --tw-ring-shadow: 0 0 #0000; --tw-shadow: 0 0 #0000; --tw-shadow-colored: 0 0 #0000; --tw-blur: ; --tw-brightness: ; --tw-contrast: ; --tw-grayscale: ; --tw-hue-rotate: ; --tw-invert: ; --tw-saturate: ; --tw-sepia: ; --tw-drop-shadow: ; --tw-backdrop-blur: ; --tw-backdrop-brightness: ; --tw-backdrop-contrast: ; --tw-backdrop-grayscale: ; --tw-backdrop-hue-rotate: ; --tw-backdrop-invert: ; --tw-backdrop-opacity: ; --tw-backdrop-saturate: ; --tw-backdrop-sepia: ; --tw-contain-size: ; --tw-contain-layout: ; --tw-contain-paint: ; --tw-contain-style: ; color: rgb(228 47 3/var(--tw-text-opacity)); text-decoration: inherit; --tw-text-opacity: 1;">Apple MacBook</a>,<span>&nbsp;</span><a class="text-bg-primary hover:underline" href="http://sotoboro.com/#" style="box-sizing: border-box; border: 0px solid rgb(229, 231, 235); --tw-border-spacing-x: 0; --tw-border-spacing-y: 0; --tw-translate-x: 0; --tw-translate-y: 0; --tw-rotate: 0; --tw-skew-x: 0; --tw-skew-y: 0; --tw-scale-x: 1; --tw-scale-y: 1; --tw-pan-x: ; --tw-pan-y: ; --tw-pinch-zoom: ; --tw-scroll-snap-strictness: proximity; --tw-gradient-from-position: ; --tw-gradient-via-position: ; --tw-gradient-to-position: ; --tw-ordinal: ; --tw-slashed-zero: ; --tw-numeric-figure: ; --tw-numeric-spacing: ; --tw-numeric-fraction: ; --tw-ring-inset: ; --tw-ring-offset-width: 0px; --tw-ring-offset-color: #fff; --tw-ring-color: rgba(59,130,246,.5); --tw-ring-offset-shadow: 0 0 #0000; --tw-ring-shadow: 0 0 #0000; --tw-shadow: 0 0 #0000; --tw-shadow-colored: 0 0 #0000; --tw-blur: ; --tw-brightness: ; --tw-contrast: ; --tw-grayscale: ; --tw-hue-rotate: ; --tw-invert: ; --tw-saturate: ; --tw-sepia: ; --tw-drop-shadow: ; --tw-backdrop-blur: ; --tw-backdrop-brightness: ; --tw-backdrop-contrast: ; --tw-backdrop-grayscale: ; --tw-backdrop-hue-rotate: ; --tw-backdrop-invert: ; --tw-backdrop-opacity: ; --tw-backdrop-saturate: ; --tw-backdrop-sepia: ; --tw-contain-size: ; --tw-contain-layout: ; --tw-contain-paint: ; --tw-contain-style: ; color: rgb(228 47 3/var(--tw-text-opacity)); text-decoration: inherit; --tw-text-opacity: 1;">Asus</a>,<span>&nbsp;</span><a class="text-bg-primary hover:underline" href="http://sotoboro.com/#" style="box-sizing: border-box; border: 0px solid rgb(229, 231, 235); --tw-border-spacing-x: 0; --tw-border-spacing-y: 0; --tw-translate-x: 0; --tw-translate-y: 0; --tw-rotate: 0; --tw-skew-x: 0; --tw-skew-y: 0; --tw-scale-x: 1; --tw-scale-y: 1; --tw-pan-x: ; --tw-pan-y: ; --tw-pinch-zoom: ; --tw-scroll-snap-strictness: proximity; --tw-gradient-from-position: ; --tw-gradient-via-position: ; --tw-gradient-to-position: ; --tw-ordinal: ; --tw-slashed-zero: ; --tw-numeric-figure: ; --tw-numeric-spacing: ; --tw-numeric-fraction: ; --tw-ring-inset: ; --tw-ring-offset-width: 0px; --tw-ring-offset-color: #fff; --tw-ring-color: rgba(59,130,246,.5); --tw-ring-offset-shadow: 0 0 #0000; --tw-ring-shadow: 0 0 #0000; --tw-shadow: 0 0 #0000; --tw-shadow-colored: 0 0 #0000; --tw-blur: ; --tw-brightness: ; --tw-contrast: ; --tw-grayscale: ; --tw-hue-rotate: ; --tw-invert: ; --tw-saturate: ; --tw-sepia: ; --tw-drop-shadow: ; --tw-backdrop-blur: ; --tw-backdrop-brightness: ; --tw-backdrop-contrast: ; --tw-backdrop-grayscale: ; --tw-backdrop-hue-rotate: ; --tw-backdrop-invert: ; --tw-backdrop-opacity: ; --tw-backdrop-saturate: ; --tw-backdrop-sepia: ; --tw-contain-size: ; --tw-contain-layout: ; --tw-contain-paint: ; --tw-contain-style: ; color: rgb(228 47 3/var(--tw-text-opacity)); text-decoration: inherit; --tw-text-opacity: 1;">Acer</a>,<span>&nbsp;</span><a class="text-bg-primary hover:underline" href="http://sotoboro.com/#" style="box-sizing: border-box; border: 0px solid rgb(229, 231, 235); --tw-border-spacing-x: 0; --tw-border-spacing-y: 0; --tw-translate-x: 0; --tw-translate-y: 0; --tw-rotate: 0; --tw-skew-x: 0; --tw-skew-y: 0; --tw-scale-x: 1; --tw-scale-y: 1; --tw-pan-x: ; --tw-pan-y: ; --tw-pinch-zoom: ; --tw-scroll-snap-strictness: proximity; --tw-gradient-from-position: ; --tw-gradient-via-position: ; --tw-gradient-to-position: ; --tw-ordinal: ; --tw-slashed-zero: ; --tw-numeric-figure: ; --tw-numeric-spacing: ; --tw-numeric-fraction: ; --tw-ring-inset: ; --tw-ring-offset-width: 0px; --tw-ring-offset-color: #fff; --tw-ring-color: rgba(59,130,246,.5); --tw-ring-offset-shadow: 0 0 #0000; --tw-ring-shadow: 0 0 #0000; --tw-shadow: 0 0 #0000; --tw-shadow-colored: 0 0 #0000; --tw-blur: ; --tw-brightness: ; --tw-contrast: ; --tw-grayscale: ; --tw-hue-rotate: ; --tw-invert: ; --tw-saturate: ; --tw-sepia: ; --tw-drop-shadow: ; --tw-backdrop-blur: ; --tw-backdrop-brightness: ; --tw-backdrop-contrast: ; --tw-backdrop-grayscale: ; --tw-backdrop-hue-rotate: ; --tw-backdrop-invert: ; --tw-backdrop-opacity: ; --tw-backdrop-saturate: ; --tw-backdrop-sepia: ; --tw-contain-size: ; --tw-contain-layout: ; --tw-contain-paint: ; --tw-contain-style: ; color: rgb(228 47 3/var(--tw-text-opacity)); text-decoration: inherit; --tw-text-opacity: 1;">Lenovo</a>,<span>&nbsp;</span><a class="text-bg-primary hover:underline" href="http://sotoboro.com/#" style="box-sizing: border-box; border: 0px solid rgb(229, 231, 235); --tw-border-spacing-x: 0; --tw-border-spacing-y: 0; --tw-translate-x: 0; --tw-translate-y: 0; --tw-rotate: 0; --tw-skew-x: 0; --tw-skew-y: 0; --tw-scale-x: 1; --tw-scale-y: 1; --tw-pan-x: ; --tw-pan-y: ; --tw-pinch-zoom: ; --tw-scroll-snap-strictness: proximity; --tw-gradient-from-position: ; --tw-gradient-via-position: ; --tw-gradient-to-position: ; --tw-ordinal: ; --tw-slashed-zero: ; --tw-numeric-figure: ; --tw-numeric-spacing: ; --tw-numeric-fraction: ; --tw-ring-inset: ; --tw-ring-offset-width: 0px; --tw-ring-offset-color: #fff; --tw-ring-color: rgba(59,130,246,.5); --tw-ring-offset-shadow: 0 0 #0000; --tw-ring-shadow: 0 0 #0000; --tw-shadow: 0 0 #0000; --tw-shadow-colored: 0 0 #0000; --tw-blur: ; --tw-brightness: ; --tw-contrast: ; --tw-grayscale: ; --tw-hue-rotate: ; --tw-invert: ; --tw-saturate: ; --tw-sepia: ; --tw-drop-shadow: ; --tw-backdrop-blur: ; --tw-backdrop-brightness: ; --tw-backdrop-contrast: ; --tw-backdrop-grayscale: ; --tw-backdrop-hue-rotate: ; --tw-backdrop-invert: ; --tw-backdrop-opacity: ; --tw-backdrop-saturate: ; --tw-backdrop-sepia: ; --tw-contain-size: ; --tw-contain-layout: ; --tw-contain-paint: ; --tw-contain-style: ; color: rgb(228 47 3/var(--tw-text-opacity)); text-decoration: inherit; --tw-text-opacity: 1;">Microsoft Surface</a>, MSI, Gigabyte,<span>&nbsp;</span><a class="text-bg-primary hover:underline" href="http://sotoboro.com/#" style="box-sizing: border-box; border: 0px solid rgb(229, 231, 235); --tw-border-spacing-x: 0; --tw-border-spacing-y: 0; --tw-translate-x: 0; --tw-translate-y: 0; --tw-rotate: 0; --tw-skew-x: 0; --tw-skew-y: 0; --tw-scale-x: 1; --tw-scale-y: 1; --tw-pan-x: ; --tw-pan-y: ; --tw-pinch-zoom: ; --tw-scroll-snap-strictness: proximity; --tw-gradient-from-position: ; --tw-gradient-via-position: ; --tw-gradient-to-position: ; --tw-ordinal: ; --tw-slashed-zero: ; --tw-numeric-figure: ; --tw-numeric-spacing: ; --tw-numeric-fraction: ; --tw-ring-inset: ; --tw-ring-offset-width: 0px; --tw-ring-offset-color: #fff; --tw-ring-color: rgba(59,130,246,.5); --tw-ring-offset-shadow: 0 0 #0000; --tw-ring-shadow: 0 0 #0000; --tw-shadow: 0 0 #0000; --tw-shadow-colored: 0 0 #0000; --tw-blur: ; --tw-brightness: ; --tw-contrast: ; --tw-grayscale: ; --tw-hue-rotate: ; --tw-invert: ; --tw-saturate: ; --tw-sepia: ; --tw-drop-shadow: ; --tw-backdrop-blur: ; --tw-backdrop-brightness: ; --tw-backdrop-contrast: ; --tw-backdrop-grayscale: ; --tw-backdrop-hue-rotate: ; --tw-backdrop-invert: ; --tw-backdrop-opacity: ; --tw-backdrop-saturate: ; --tw-backdrop-sepia: ; --tw-contain-size: ; --tw-contain-layout: ; --tw-contain-paint: ; --tw-contain-style: ; color: rgb(228 47 3/var(--tw-text-opacity)); text-decoration: inherit; --tw-text-opacity: 1;">Infinix</a>,<span>&nbsp;</span><a class="text-bg-primary hover:underline" href="http://sotoboro.com/#" style="box-sizing: border-box; border: 0px solid rgb(229, 231, 235); --tw-border-spacing-x: 0; --tw-border-spacing-y: 0; --tw-translate-x: 0; --tw-translate-y: 0; --tw-rotate: 0; --tw-skew-x: 0; --tw-skew-y: 0; --tw-scale-x: 1; --tw-scale-y: 1; --tw-pan-x: ; --tw-pan-y: ; --tw-pinch-zoom: ; --tw-scroll-snap-strictness: proximity; --tw-gradient-from-position: ; --tw-gradient-via-position: ; --tw-gradient-to-position: ; --tw-ordinal: ; --tw-slashed-zero: ; --tw-numeric-figure: ; --tw-numeric-spacing: ; --tw-numeric-fraction: ; --tw-ring-inset: ; --tw-ring-offset-width: 0px; --tw-ring-offset-color: #fff; --tw-ring-color: rgba(59,130,246,.5); --tw-ring-offset-shadow: 0 0 #0000; --tw-ring-shadow: 0 0 #0000; --tw-shadow: 0 0 #0000; --tw-shadow-colored: 0 0 #0000; --tw-blur: ; --tw-brightness: ; --tw-contrast: ; --tw-grayscale: ; --tw-hue-rotate: ; --tw-invert: ; --tw-saturate: ; --tw-sepia: ; --tw-drop-shadow: ; --tw-backdrop-blur: ; --tw-backdrop-brightness: ; --tw-backdrop-contrast: ; --tw-backdrop-grayscale: ; --tw-backdrop-hue-rotate: ; --tw-backdrop-invert: ; --tw-backdrop-opacity: ; --tw-backdrop-saturate: ; --tw-backdrop-sepia: ; --tw-contain-size: ; --tw-contain-layout: ; --tw-contain-paint: ; --tw-contain-style: ; color: rgb(228 47 3/var(--tw-text-opacity)); text-decoration: inherit; --tw-text-opacity: 1;">Walton</a>, Xiaomi MI, Huawei, Chuwi, and more.</p></div>';

  // check if HomeSEO already exists

  const defaultHomeTitle = 'Renesa Bazar';

  const homeSEO = await prisma.homeSEO.findFirst();

  if (!homeSEO) {
    // create HomeSEO
    await prisma.homeSEO.create({
      data: {
        title: defaultHomeTitle,
        description: defaultHomeSEO,
      },
    });
  }

  const defaultTermsAndConditions = `<meta charset='utf-8'><meta charset="utf-8"><b style="font-weight:normal;" id="docs-internal-guid-ef29a2cd-7fff-4524-bcbd-b5b3908b3383"><p dir="ltr" style="line-height:1.38;margin-top:12pt;margin-bottom:12pt;"><span style="font-size:11pt;font-family:Arial,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">Dear Valued Customers,</span></p><p dir="ltr" style="line-height:1.38;margin-top:12pt;margin-bottom:12pt;"><a href="https://www.renesabazar.com/" style="text-decoration:none;"><span style="font-size:11pt;font-family:Arial,sans-serif;color:#1155cc;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:underline;-webkit-text-decoration-skip:none;text-decoration-skip-ink:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">Renesa Bazar</span></a><span style="font-size:11pt;font-family:Arial,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;"> is committed to providing the highest level of customer service. To ensure the quality, timeliness, and efficiency of our services, we request our customers to adhere to the following terms and conditions before making a purchase. Thank you for your cooperation.</span></p><h3 dir="ltr" style="line-height:1.38;margin-top:12pt;margin-bottom:2pt;"><span style="font-size:13.999999999999998pt;font-family:Arial,sans-serif;color:#000000;background-color:transparent;font-weight:700;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">Warranty Information</span></h3><ol style="margin-top:0;margin-bottom:0;padding-inline-start:48px;"><li dir="ltr" style="list-style-type:decimal;font-size:12pt;font-family:Arial,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;" aria-level="1"><h4 dir="ltr" style="line-height:1.38;margin-top:12pt;margin-bottom:12pt;" role="presentation"><span style="font-size:12pt;font-family:Arial,sans-serif;color:#000000;background-color:transparent;font-weight:700;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">Manufacturer Warranty</span><span style="font-size:12pt;font-family:Arial,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">:&nbsp;</span></h4></li></ol><p dir="ltr" style="line-height:1.38;margin-left: 36pt;margin-top:12pt;margin-bottom:12pt;"><span style="font-size:11pt;font-family:Arial,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">The warranty provided at the time of sale is offered by the product manufacturer. Renesa Bazar acts as a facilitator to enforce the warranty terms and conditions set by the original brand companies.</span></p><br /><ol style="margin-top:0;margin-bottom:0;padding-inline-start:48px;" start="2"><li dir="ltr" style="list-style-type:decimal;font-size:12pt;font-family:Arial,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;" aria-level="1"><h4 dir="ltr" style="line-height:1.38;margin-top:12pt;margin-bottom:0pt;" role="presentation"><span style="font-size:12pt;font-family:Arial,sans-serif;color:#000000;background-color:transparent;font-weight:700;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">Warranty Terms</span><span style="font-size:12pt;font-family:Arial,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">:</span></h4></li><ul style="margin-top:0;margin-bottom:0;padding-inline-start:48px;"><li dir="ltr" style="list-style-type:circle;font-size:11pt;font-family:Arial,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;" aria-level="2"><p dir="ltr" style="line-height:1.38;margin-top:0pt;margin-bottom:0pt;" role="presentation"><span style="font-size:11pt;font-family:Arial,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">Renesa Bazar follows international, domestic, and </span><a href="https://bcs.org.bd/" style="text-decoration:none;"><span style="font-size:11pt;font-family:Arial,sans-serif;color:#1155cc;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:underline;-webkit-text-decoration-skip:none;text-decoration-skip-ink:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">Bangladesh Computer Samiti (BCS)</span></a><span style="font-size:11pt;font-family:Arial,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;"> standards for warranty policies.</span></p></li><li dir="ltr" style="list-style-type:circle;font-size:11pt;font-family:Arial,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;" aria-level="2"><p dir="ltr" style="line-height:1.38;margin-top:0pt;margin-bottom:12pt;" role="presentation"><span style="font-size:11pt;font-family:Arial,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">Warranty is a service agreement between the manufacturer or importer and the buyer. This agreement entrusts the manufacturer or importer with the responsibility for repairing or replacing the sold product. Renesa Bazar assists customers in obtaining warranty services and acts as an intermediary.</span></p></li></ul></ol><br /><ol style="margin-top:0;margin-bottom:0;padding-inline-start:48px;" start="3"><li dir="ltr" style="list-style-type:decimal;font-size:12pt;font-family:Arial,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;" aria-level="1"><h4 dir="ltr" style="line-height:1.38;margin-top:12pt;margin-bottom:0pt;" role="presentation"><span style="font-size:12pt;font-family:Arial,sans-serif;color:#000000;background-color:transparent;font-weight:700;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">Warranty Coverage</span><span style="font-size:12pt;font-family:Arial,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">:</span></h4></li><ul style="margin-top:0;margin-bottom:0;padding-inline-start:48px;"><li dir="ltr" style="list-style-type:circle;font-size:11pt;font-family:Arial,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;" aria-level="2"><p dir="ltr" style="line-height:1.38;margin-top:0pt;margin-bottom:0pt;" role="presentation"><span style="font-size:11pt;font-family:Arial,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">Not all products come with a warranty. Only those with a declared warranty period from the original manufacturer are covered.</span></p></li><li dir="ltr" style="list-style-type:circle;font-size:11pt;font-family:Arial,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;" aria-level="2"><p dir="ltr" style="line-height:1.38;margin-top:0pt;margin-bottom:0pt;" role="presentation"><span style="font-size:11pt;font-family:Arial,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">The warranty period for laptops varies from 1 to 3 years, depending on the brand and model. However, the warranty for all laptop batteries and adapters is only 1 year.</span></p></li><li dir="ltr" style="list-style-type:circle;font-size:11pt;font-family:Arial,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;" aria-level="2"><p dir="ltr" style="line-height:1.38;margin-top:0pt;margin-bottom:0pt;" role="presentation"><span style="font-size:11pt;font-family:Arial,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">Defective products under warranty will be repaired or replaced immediately, depending on the product type.</span></p></li><li dir="ltr" style="list-style-type:circle;font-size:11pt;font-family:Arial,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;" aria-level="2"><p dir="ltr" style="line-height:1.38;margin-top:0pt;margin-bottom:0pt;" role="presentation"><span style="font-size:11pt;font-family:Arial,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">If the specific model is unavailable, Renesa Bazar may replace it with another product of equivalent value from its stock.</span></p></li><li dir="ltr" style="list-style-type:circle;font-size:11pt;font-family:Arial,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;" aria-level="2"><p dir="ltr" style="line-height:1.38;margin-top:0pt;margin-bottom:12pt;" role="presentation"><span style="font-size:11pt;font-family:Arial,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">If a product is deemed unrepairable and no equivalent product is available, it may be replaced with a better product through depreciation and price adjustment, or a refund may be issued.</span></p></li></ul></ol><br /><ol style="margin-top:0;margin-bottom:0;padding-inline-start:48px;" start="4"><li dir="ltr" style="list-style-type:decimal;font-size:12pt;font-family:Arial,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;" aria-level="1"><h4 dir="ltr" style="line-height:1.38;margin-top:12pt;margin-bottom:0pt;" role="presentation"><span style="font-size:12pt;font-family:Arial,sans-serif;color:#000000;background-color:transparent;font-weight:700;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">Exclusions and Limitations</span><span style="font-size:12pt;font-family:Arial,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">:</span></h4></li><ul style="margin-top:0;margin-bottom:0;padding-inline-start:48px;"><li dir="ltr" style="list-style-type:circle;font-size:11pt;font-family:Arial,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;" aria-level="2"><p dir="ltr" style="line-height:1.38;margin-top:0pt;margin-bottom:0pt;" role="presentation"><span style="font-size:11pt;font-family:Arial,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">Renesa Bazar is not responsible for any software or data loss during product usage or service. Data recovery or software reinstallation is not covered.</span></p></li><li dir="ltr" style="list-style-type:circle;font-size:11pt;font-family:Arial,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;" aria-level="2"><p dir="ltr" style="line-height:1.38;margin-top:0pt;margin-bottom:0pt;" role="presentation"><span style="font-size:11pt;font-family:Arial,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">The time required to return a product after warranty service may range from 5-7 days to a maximum of 35-40 days or more, as parts may need to be specially imported.</span></p></li><li dir="ltr" style="list-style-type:circle;font-size:11pt;font-family:Arial,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;" aria-level="2"><p dir="ltr" style="line-height:1.38;margin-top:0pt;margin-bottom:0pt;" role="presentation"><span style="font-size:11pt;font-family:Arial,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">The computer setup and customized operating system provided at the time of sale are not covered under warranty.</span></p></li><li dir="ltr" style="list-style-type:circle;font-size:11pt;font-family:Arial,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;" aria-level="2"><p dir="ltr" style="line-height:1.38;margin-top:0pt;margin-bottom:0pt;" role="presentation"><span style="font-size:11pt;font-family:Arial,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">Lifetime warranty means providing warranty service as long as the product is considered marketable. If a product is deemed EOL (End of Life), it will no longer be covered under warranty. According to industry policy, customers can enjoy the lifetime warranty service for a maximum of 2 years.</span></p></li><li dir="ltr" style="list-style-type:circle;font-size:11pt;font-family:Arial,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;" aria-level="2"><p dir="ltr" style="line-height:1.38;margin-top:0pt;margin-bottom:12pt;" role="presentation"><span style="font-size:11pt;font-family:Arial,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">Renesa Bazar may charge a fee for any service outside the warranty, subject to customer consent.</span></p></li></ul></ol><h3 dir="ltr" style="line-height:1.38;margin-top:12pt;margin-bottom:2pt;"><span style="font-size:13.999999999999998pt;font-family:Arial,sans-serif;color:#000000;background-color:transparent;font-weight:700;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">Conditions Not Covered by Warranty</span></h3><ol style="margin-top:0;margin-bottom:0;padding-inline-start:48px;"><li dir="ltr" style="list-style-type:decimal;font-size:11pt;font-family:Arial,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;" aria-level="1"><p dir="ltr" style="line-height:1.38;margin-top:12pt;margin-bottom:0pt;" role="presentation"><span style="font-size:11pt;font-family:Arial,sans-serif;color:#000000;background-color:transparent;font-weight:700;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">Usage-related Damages</span><span style="font-size:11pt;font-family:Arial,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">: Damage due to careless use, such as water exposure, breakage, burns, impact, deep scratches, etc., will not be covered under warranty.</span></p></li><li dir="ltr" style="list-style-type:decimal;font-size:11pt;font-family:Arial,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;" aria-level="1"><p dir="ltr" style="line-height:1.38;margin-top:0pt;margin-bottom:0pt;" role="presentation"><span style="font-size:11pt;font-family:Arial,sans-serif;color:#000000;background-color:transparent;font-weight:700;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">Serial Number Issues</span><span style="font-size:11pt;font-family:Arial,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">: Products with partially or completely erased, lifted, or damaged serial numbers or serial stickers will not be covered under warranty.</span></p></li><li dir="ltr" style="list-style-type:decimal;font-size:11pt;font-family:Arial,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;" aria-level="1"><p dir="ltr" style="line-height:1.38;margin-top:0pt;margin-bottom:0pt;" role="presentation"><span style="font-size:11pt;font-family:Arial,sans-serif;color:#000000;background-color:transparent;font-weight:700;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">Physical Damage</span><span style="font-size:11pt;font-family:Arial,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">: Motherboards, graphics cards, or RAM with fungus, rust, deep damage, or scratches will not be covered under warranty. Motherboards and processors with broken, bent, or distorted pins will also be excluded.</span></p></li><li dir="ltr" style="list-style-type:decimal;font-size:11pt;font-family:Arial,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;" aria-level="1"><p dir="ltr" style="line-height:1.38;margin-top:0pt;margin-bottom:0pt;" role="presentation"><span style="font-size:11pt;font-family:Arial,sans-serif;color:#000000;background-color:transparent;font-weight:700;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">Password and Security Codes</span><span style="font-size:11pt;font-family:Arial,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">: Renesa Bazar does not apply passwords or security codes at the time of delivery. The responsibility for BIOS passwords rests entirely on the buyer. This is not covered under warranty.</span></p></li><li dir="ltr" style="list-style-type:decimal;font-size:11pt;font-family:Arial,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;" aria-level="1"><p dir="ltr" style="line-height:1.38;margin-top:0pt;margin-bottom:0pt;" role="presentation"><span style="font-size:11pt;font-family:Arial,sans-serif;color:#000000;background-color:transparent;font-weight:700;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">Operating System Issues</span><span style="font-size:11pt;font-family:Arial,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">: Erasing the proprietary operating system of an Apple MacBook will void the warranty.</span></p></li><li dir="ltr" style="list-style-type:decimal;font-size:11pt;font-family:Arial,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;" aria-level="1"><p dir="ltr" style="line-height:1.38;margin-top:0pt;margin-bottom:0pt;" role="presentation"><span style="font-size:11pt;font-family:Arial,sans-serif;color:#000000;background-color:transparent;font-weight:700;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">Printer Components</span><span style="font-size:11pt;font-family:Arial,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">: Printer cartridges, toners, heads, rollers, drums, element covers, etc., are not covered under warranty.</span></p></li><li dir="ltr" style="list-style-type:decimal;font-size:11pt;font-family:Arial,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;" aria-level="1"><p dir="ltr" style="line-height:1.38;margin-top:0pt;margin-bottom:0pt;" role="presentation"><span style="font-size:11pt;font-family:Arial,sans-serif;color:#000000;background-color:transparent;font-weight:700;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">Third-party Ink or Toner</span><span style="font-size:11pt;font-family:Arial,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">: Using ink cartridges or toner cartridges other than those specified by the manufacturer will void the warranty.</span></p></li><li dir="ltr" style="list-style-type:decimal;font-size:11pt;font-family:Arial,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;" aria-level="1"><p dir="ltr" style="line-height:1.38;margin-top:0pt;margin-bottom:0pt;" role="presentation"><span style="font-size:11pt;font-family:Arial,sans-serif;color:#000000;background-color:transparent;font-weight:700;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">Combo Products</span><span style="font-size:11pt;font-family:Arial,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">: For combo keyboard-mouse sets, if either the keyboard or mouse is damaged, the entire set (including accessories) must be presented for warranty. Individual components will not be accepted.</span></p></li><li dir="ltr" style="list-style-type:decimal;font-size:11pt;font-family:Arial,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;" aria-level="1"><p dir="ltr" style="line-height:1.38;margin-top:0pt;margin-bottom:0pt;" role="presentation"><span style="font-size:11pt;font-family:Arial,sans-serif;color:#000000;background-color:transparent;font-weight:700;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">Power Adapters</span><span style="font-size:11pt;font-family:Arial,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">: Power adapters for products like printers, scanners, routers, switches, access points, TV cards, etc., are not covered under warranty.</span></p></li><li dir="ltr" style="list-style-type:decimal;font-size:11pt;font-family:Arial,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;" aria-level="1"><p dir="ltr" style="line-height:1.38;margin-top:0pt;margin-bottom:12pt;" role="presentation"><span style="font-size:11pt;font-family:Arial,sans-serif;color:#000000;background-color:transparent;font-weight:700;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">Warranty Paper Loss</span><span style="font-size:11pt;font-family:Arial,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">: In case the warranty receipt paper is lost, the product must be received with the purchase receipt and appropriate proof.</span></p></li></ol><h3 dir="ltr" style="line-height:1.38;margin-top:12pt;margin-bottom:2pt;"><span style="font-size:13.999999999999998pt;font-family:Arial,sans-serif;color:#000000;background-color:transparent;font-weight:700;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">Additional Information</span></h3><ul style="margin-top:0;margin-bottom:0;padding-inline-start:48px;"><li dir="ltr" style="list-style-type:disc;font-size:11pt;font-family:Arial,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;" aria-level="1"><p dir="ltr" style="line-height:1.38;margin-top:12pt;margin-bottom:0pt;" role="presentation"><span style="font-size:11pt;font-family:Arial,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">If a product is with the warranty or service department for more than 2 months, the company will not be responsible for that product.</span></p></li><li dir="ltr" style="list-style-type:disc;font-size:11pt;font-family:Arial,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;" aria-level="1"><p dir="ltr" style="line-height:1.38;margin-top:0pt;margin-bottom:0pt;" role="presentation"><span style="font-size:11pt;font-family:Arial,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">For any part replacement or addition required under service warranty, customers must obtain it at their own responsibility or, with customer consent, advance payment can be made to obtain it through Renesa Bazar.</span></p></li><li dir="ltr" style="list-style-type:disc;font-size:11pt;font-family:Arial,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;" aria-level="1"><p dir="ltr" style="line-height:1.38;margin-top:0pt;margin-bottom:0pt;" role="presentation"><span style="font-size:11pt;font-family:Arial,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">Renesa Bazar is not responsible for any new issues arising from free software or hardware tuning provided during the warranty period.</span></p></li><li dir="ltr" style="list-style-type:disc;font-size:11pt;font-family:Arial,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;" aria-level="1"><p dir="ltr" style="line-height:1.38;margin-top:0pt;margin-bottom:0pt;" role="presentation"><span style="font-size:11pt;font-family:Arial,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">For dead pixel-related warranty claims on monitors, a minimum of 3 or more dead pixels must be visible.</span></p></li><li dir="ltr" style="list-style-type:disc;font-size:11pt;font-family:Arial,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;" aria-level="1"><p dir="ltr" style="line-height:1.38;margin-top:0pt;margin-bottom:12pt;" role="presentation"><span style="font-size:11pt;font-family:Arial,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">The product box must be brought along for warranty claims.</span></p></li></ul><p dir="ltr" style="line-height:1.38;margin-top:12pt;margin-bottom:12pt;"><span style="font-size:11pt;font-family:Arial,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">Thank you for choosing Renesa Bazar.</span></p></b><br class="Apple-interchange-newline">`;

  // check if TermsAndConditions already exists

  const termsAndConditions = await prisma.termsAndCondition.findFirst();

  if (!termsAndConditions) {
    // create TermsAndConditions
    await prisma.termsAndCondition.create({
      data: {
        description: defaultTermsAndConditions,
      },
    });
  }
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async e => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
