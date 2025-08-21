import {
    Box,
    Convert3DCube,
    DriverRefresh,
    FormatCircle,
    House,
    I3DRotate,
    LocationAdd,
    Profile2User,
    UserEdit
} from 'iconsax-reactjs'

export const EPOS_FEATURES = [
    {
        icon: <Convert3DCube size="35" color="#EF30C5" variant="Bulk" />,
        color: '#EF30C5',
        title: "Online and Offline Sync",
        description: "Offline orders sync automatically when switching to the online mode of the POS system."
    },
    {
        icon: <I3DRotate size="35" color="#2757D2" variant="Bulk" />,
        color: '#2757D2',
        title: "Supplier Management",
        description: "Reduce 60% of time by tracking, collaborating, qualifying, transacting, and monitoring suppliers."
    },
    {
        icon: <LocationAdd size="32" color="#F2742D" variant="Bulk" />,
        color: '#F2742D',
        title: "Multi Location",
        description: "Manage and track multiple stores across locations with one software, enabling easy expansion"
    },
    {
        icon: <Profile2User size="32" color="#16BE6A" variant="Bulk" />,
        color: '#16BE6A',
        title: "Multi Users",
        description: "The unlimited license authorizes the use of the GETPOS concurrently by all users within an organization and has no limit on end-user installations."
    },
    {
        icon: <FormatCircle size="32" color="#EF30C5" variant="Bulk" />,
        color: '#EF30C5',
        title: "Integration",
        description: "E-POS offers a wide range of integration capabilities that allow businesses to seamlessly connect with third-party applications and services."
    },
    {
        icon: <Box size="32" color="#CCB910" variant="Bulk" />,
        color: '#CCB910',
        title: "Order Management System",
        description: "Enhance order processing with real-time tracking and centralized sales data, ensuring accuracy and efficiency."
    },
    {
        icon: <House size="32" color="#CCB910" variant="Bulk" />,
        color: '#CCB910',
        title: "Warehouse Management System",
        description: "Optimize inventory tracking and warehouse operations to maintain stock levels and reduce overhead costs."
    },
    {
        icon: <DriverRefresh size="32" color="#2757D2" variant="Bulk" />,
        color: '#2757D2',
        title: "Integrated Accounting Operations",
        description: "Simplify finances with automated transactions and real-time insights, making financial management hassle-free."
    },
    {
        icon: <UserEdit size="32" color="#F2742D" variant="Bulk" />,
        color: '#F2742D',
        title: "HR & Payroll Management",
        description: "Efficiently manage employee data and payroll with integrated tools, ensuring compliance and accuracy."
    }
]