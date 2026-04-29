import React from 'react';
import { Link } from 'react-router-dom';

// Pages Starter
export const PagesStarter = () => (
    <React.Fragment>
        <div className="page-content">
            <div className="container-fluid">
                <div className="row">
                    <div className="col-12">
                        <div className="page-title-box d-sm-flex align-items-center justify-content-between">
                            <h4 className="mb-sm-0 font-size-18">Starter Page</h4>
                            <div className="page-title-right">
                                <ol className="breadcrumb m-0">
                                    <li className="breadcrumb-item"><Link to="#">Pages</Link></li>
                                    <li className="breadcrumb-item active">Starter Page</li>
                                </ol>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
                        <div className="card">
                            <div className="card-body">
                                <h4 className="card-title">Start your coding!</h4>
                                <p className="card-title-desc">Start creating your project. Start creating your project!</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </React.Fragment>
);

// Pages Timeline
export const PagesTimeline = () => (
    <React.Fragment>
        <div className="page-content">
            <div className="container-fluid">
                <div className="row">
                    <div className="col-12">
                        <div className="page-title-box d-sm-flex align-items-center justify-content-between">
                            <h4 className="mb-sm-0 font-size-18">Timeline</h4>
                            <div className="page-title-right">
                                <ol className="breadcrumb m-0">
                                    <li className="breadcrumb-item"><Link to="#">Pages</Link></li>
                                    <li className="breadcrumb-item active">Timeline</li>
                                </ol>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row justify-content-center">
                    <div className="col-xl-10">
                        <div className="timeline">
                            {[
                                { date: 'March 2023', title: 'Event Title 1', desc: 'It will be as simple as in fact it will be Occidental to an English person.', time: '5 hrs ago', icon: 'bx-cart', color: 'primary' },
                                { date: 'February 2023', title: 'Event Title 2', desc: 'Combines the strength of HTML with Bourbon, a mixin library.', time: '10 hrs ago', icon: 'bx-phone', color: 'success' },
                                { date: 'January 2023', title: 'Event Title 3', desc: 'One could refuse to desensitise the beauty of one\'s own native language.', time: '1 day ago', icon: 'bx-envelope', color: 'info' },
                            ].map((item, idx) => (
                                <div className="timeline-item" key={idx}>
                                    <div className="timeline-block">
                                        <div className={`timeline-box card`}>
                                            <div className="card-body">
                                                <span className="timeline-icon"><i className={`bx ${item.icon} text-${item.color}`}></i></span>
                                                <p className="timeline-date text-muted"><i className="mdi mdi-calendar-outline me-2"></i>{item.date}</p>
                                                <h5 className="mt-3 font-size-15">{item.title}</h5>
                                                <p className="text-muted mb-0">{item.desc}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </React.Fragment>
);

// Pages FAQs 
export const PagesFAQs = () => (
    <React.Fragment>
        <div className="page-content">
            <div className="container-fluid">
                <div className="row">
                    <div className="col-12">
                        <div className="page-title-box d-sm-flex align-items-center justify-content-between">
                            <h4 className="mb-sm-0 font-size-18">FAQs</h4>
                            <div className="page-title-right">
                                <ol className="breadcrumb m-0">
                                    <li className="breadcrumb-item"><Link to="#">Pages</Link></li>
                                    <li className="breadcrumb-item active">FAQs</li>
                                </ol>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row justify-content-center">
                    <div className="col-lg-12">
                        <div className="text-center mb-5">
                            <h4>Frequently Asked Questions</h4>
                            <p className="text-muted">Here are some common questions answered for you.</p>
                        </div>
                    </div>
                </div>
                <div className="row">
                    {[
                        { q: 'What is Minia ?', a: 'Minia is a fully featured premium admin template built on top of Bootstrap 5.' },
                        { q: 'Does it support Sass ?', a: 'Yes, Minia is fully compatible with Sass which makes it easy to customize your design.' },
                        { q: 'Will you provide updates ?', a: 'Yes, we provide regular updates to keep the template up-to-date with Bootstrap and other dependencies.' },
                        { q: 'Is there documentation ?', a: 'Yes, Minia comes with detailed documentation to help you get started quickly.' },
                    ].map((faq, idx) => (
                        <div className="col-lg-6" key={idx}>
                            <div className="card">
                                <div className="card-body">
                                    <div className="d-flex">
                                        <div className="flex-shrink-0 me-3">
                                            <div className="avatar-xs">
                                                <div className="avatar-title rounded-circle bg-primary-subtle text-primary font-size-16">Q</div>
                                            </div>
                                        </div>
                                        <div className="flex-grow-1">
                                            <p className="text-muted">{faq.q}</p>
                                        </div>
                                    </div>
                                    <div className="d-flex mt-3">
                                        <div className="flex-shrink-0 me-3">
                                            <div className="avatar-xs">
                                                <div className="avatar-title rounded-circle bg-info-subtle text-info font-size-16">A</div>
                                            </div>
                                        </div>
                                        <div className="flex-grow-1">
                                            <p className="text-muted">{faq.a}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </React.Fragment>
);

// Pages Pricing
export const PagesPricing = () => (
    <React.Fragment>
        <div className="page-content">
            <div className="container-fluid">
                <div className="row">
                    <div className="col-12">
                        <div className="page-title-box d-sm-flex align-items-center justify-content-between">
                            <h4 className="mb-sm-0 font-size-18">Pricing</h4>
                            <div className="page-title-right">
                                <ol className="breadcrumb m-0">
                                    <li className="breadcrumb-item"><Link to="#">Pages</Link></li>
                                    <li className="breadcrumb-item active">Pricing</li>
                                </ol>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row justify-content-center">
                    <div className="col-lg-5">
                        <div className="text-center mb-5">
                            <h4>Choose your Pricing plan</h4>
                            <p className="text-muted">Several plans to meet your needs</p>
                        </div>
                    </div>
                </div>
                <div className="row">
                    {[
                        { plan: 'Starter', price: '0', color: 'primary', features: ['5 Projects', '100 Tasks', '1 GB Storage', 'Email Support', 'Limited API Access'] },
                        { plan: 'Professional', price: '19', color: 'success', features: ['25 Projects', 'Unlimited Tasks', '10 GB Storage', 'Priority Support', 'Full API Access'] },
                        { plan: 'Enterprise', price: '49', color: 'info', features: ['Unlimited Projects', 'Unlimited Tasks', '100 GB Storage', '24/7 Support', 'Dedicated Manager'] },
                    ].map((plan, idx) => (
                        <div className="col-xl-4 col-md-6" key={idx}>
                            <div className="card plan-box">
                                <div className="card-body p-4">
                                    <div className="d-flex">
                                        <div className="flex-grow-1">
                                            <h5>{plan.plan}</h5>
                                            <p className="text-muted">{plan.plan === 'Starter' ? 'Free for individuals' : plan.plan === 'Professional' ? 'For small teams' : 'For large organizations'}</p>
                                        </div>
                                        <div className="flex-shrink-0 ms-3">
                                            <i className={`bx bx-walk display-4 text-${plan.color}`}></i>
                                        </div>
                                    </div>
                                    <div className={`py-4 border-top border-bottom`}>
                                        <h2><sup><small>$</small></sup> {plan.price}/ <span className="font-size-13 text-muted">Per month</span></h2>
                                    </div>
                                    <div className="plan-features mt-3">
                                        {plan.features.map((f, i) => (
                                            <p key={i}><i className="bx bx-checkbox-square text-primary me-2"></i>{f}</p>
                                        ))}
                                    </div>
                                    <div className="text-center mt-4 pt-2">
                                        <Link to="#" className={`btn btn-${plan.color} w-md`}>Get Started</Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </React.Fragment>
);

// Pages Maintenance
export const PagesMaintenance = () => (
    <React.Fragment>
        <div className="my-5">
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <div className="text-center">
                            <div className="mb-5"><img src="/assets/images/maintenance.png" alt="" className="img-fluid" /></div>
                            <h3 className="mt-5">Site is Under Maintenance</h3>
                            <p>Please check back in some time.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </React.Fragment>
);

// Pages Coming Soon
export const PagesComingSoon = () => (
    <React.Fragment>
        <div className="my-5">
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <div className="text-center">
                            <h1 className="display-2 fw-medium">Coming <span className="text-primary">Soon</span></h1>
                            <h4 className="mt-4">Let's get started. We're almost there!</h4>
                            <p className="text-muted">It will be as simple as Occidental it to an English person, it will seem like simplified English.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </React.Fragment>
);
