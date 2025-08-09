/**
 * Wizard Forms Test Page - PropertyChain
 * Tests all wizard form components and features
 */

'use client'

import { useState, useCallback } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import {
  WizardForm,
  StepNavigator,
  FormStep,
  useWizardForm,
  createMockWizardSteps,
  type WizardStep,
  type WizardStepProps,
  type WizardFormData,
} from '@/components/custom/wizard-forms'
import {
  PropertyListingWizard,
  TransactionWizard,
  type PropertyListingData,
  type TransactionData,
} from '@/components/custom/property-wizards'
import {
  ArrowRight,
  ArrowLeft,
  Check,
  X,
  AlertCircle,
  Info,
  CheckCircle,
  Clock,
  Star,
  Home,
  Building,
  DollarSign,
  FileText,
  Camera,
  MapPin,
  Calendar,
  Users,
  Settings,
  Shield,
  Zap,
  Target,
  BookOpen,
  Clipboard,
  Key,
  Search,
  Filter,
  Upload,
  Download,
  Eye,
  Edit,
  Trash2,
  Save,
  Send,
  User,
  Phone,
  Mail,
  Globe,
  Briefcase,
  Award,
  TrendingUp,
  Activity,
  Heart,
  Layers,
  Navigation,
  PlayCircle,
  PauseCircle,
  RotateCcw,
  RefreshCw,
} from 'lucide-react'
import { addDays, subDays, subHours, subMinutes } from 'date-fns'
import { toastSuccess, toastInfo, toastError, toastWarning } from '@/lib/toast'

// Mock wizard data
const mockWizardSteps = createMockWizardSteps()

export default function TestWizardFormsPage() {
  const [selectedTab, setSelectedTab] = useState('basic')
  const [completedWizards, setCompletedWizards] = useState<Set<string>>(new Set())
  
  // Basic wizard state
  const {
    steps: basicSteps,
    currentStepIndex: basicCurrentStep,
    goToStep: basicGoToStep,
    resetForm: basicResetForm,
    completedStepsCount: basicCompletedCount,
    progress: basicProgress,
  } = useWizardForm(mockWizardSteps)

  const handleBasicWizardComplete = useCallback((data: WizardFormData) => {
    setCompletedWizards(prev => new Set(prev).add('basic'))
    toastSuccess('Basic wizard completed successfully!')
    console.log('Basic wizard data:', data)
  }, [])

  const handlePropertyListingComplete = useCallback((data: PropertyListingData) => {
    setCompletedWizards(prev => new Set(prev).add('property'))
    toastSuccess('Property listing created successfully!')
    console.log('Property listing data:', data)
  }, [])

  const handleTransactionComplete = useCallback((data: TransactionData) => {
    setCompletedWizards(prev => new Set(prev).add('transaction'))
    toastSuccess('Transaction setup completed!')
    console.log('Transaction data:', data)
  }, [])

  const handleWizardCancel = useCallback((type: string) => {
    toastWarning(`${type} wizard cancelled`)
  }, [])

  const resetWizard = useCallback((type: string) => {
    setCompletedWizards(prev => {
      const newSet = new Set(prev)
      newSet.delete(type)
      return newSet
    })
    if (type === 'basic') {
      basicResetForm()
    }
    toastInfo(`${type} wizard reset`)
  }, [basicResetForm])

  // Stats calculations
  const totalSteps = mockWizardSteps.length
  const activeWizards = 3 // Basic, Property, Transaction
  const completedWizardsCount = completedWizards.size

  const generateSampleStep = () => {
    const currentStep = basicSteps[basicCurrentStep]
    if (currentStep && !currentStep.isCompleted) {
      // Simulate step completion
      toastSuccess(`Step "${currentStep.title}" completed`)
      if (basicCurrentStep < basicSteps.length - 1) {
        basicGoToStep(basicCurrentStep + 1)
      }
    } else {
      toastInfo('All steps are already completed!')
    }
  }

  const generateValidationError = () => {
    toastError('Validation error: Please check required fields')
  }

  return (
    <div className="container mx-auto p-8 max-w-7xl">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Wizard Forms Test</h1>
            <p className="text-muted-foreground">
              Testing multi-step wizard forms with progress indicators, validation, and PropertyChain features
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Button onClick={generateSampleStep}>
              <ArrowRight className="mr-2 h-4 w-4" />
              Complete Current Step
            </Button>
            <Button onClick={generateValidationError} variant="outline">
              <AlertCircle className="mr-2 h-4 w-4" />
              Trigger Validation Error
            </Button>
          </div>
        </div>
      </div>

      {/* Wizard Stats */}
      <div className="grid gap-4 md:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Steps
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-blue-500" />
              <span className="text-2xl font-bold text-blue-500">{totalSteps}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Wizards
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Navigation className="h-4 w-4 text-green-500" />
              <span className="text-2xl font-bold text-green-500">{activeWizards}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Completed Wizards
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-purple-500" />
              <span className="text-2xl font-bold text-purple-500">{completedWizardsCount}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Overall Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-orange-500" />
              <span className="text-2xl font-bold text-orange-500">
                {Math.round((completedWizardsCount / activeWizards) * 100)}%
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="basic">Basic Wizard</TabsTrigger>
          <TabsTrigger value="property">Property Listing</TabsTrigger>
          <TabsTrigger value="transaction">Transaction</TabsTrigger>
          <TabsTrigger value="components">Components</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="validation">Validation</TabsTrigger>
        </TabsList>

        {/* Basic Wizard Tab */}
        <TabsContent value="basic" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Basic Multi-Step Wizard</CardTitle>
                  <CardDescription>
                    Demonstrates core wizard functionality with step navigation, progress tracking, and validation
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">
                    {basicCompletedCount} of {totalSteps} steps
                  </Badge>
                  <Badge variant="outline">
                    {Math.round(basicProgress)}% complete
                  </Badge>
                  {completedWizards.has('basic') && (
                    <Badge variant="default">
                      <Check className="mr-1 h-3 w-3" />
                      Completed
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 lg:grid-cols-4">
                {/* Step Navigator */}
                <div className="lg:col-span-1">
                  <div className="sticky top-4">
                    <h3 className="font-medium mb-4">Steps</h3>
                    <StepNavigator
                      steps={basicSteps}
                      currentStepIndex={basicCurrentStep}
                      completedSteps={new Set(basicSteps.map((_, i) => i).filter(i => basicSteps[i]?.isCompleted))}
                      onStepClick={basicGoToStep}
                      variant="detailed"
                    />
                    
                    <div className="mt-6 space-y-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => resetWizard('basic')}
                        className="w-full"
                      >
                        <RotateCcw className="mr-2 h-4 w-4" />
                        Reset Wizard
                      </Button>
                      {completedWizards.has('basic') && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => basicGoToStep(0)}
                          className="w-full"
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          Review Again
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Main Wizard */}
                <div className="lg:col-span-3">
                  <WizardForm
                    steps={basicSteps}
                    currentStepIndex={basicCurrentStep}
                    onStepChange={basicGoToStep}
                    onComplete={handleBasicWizardComplete}
                    onCancel={() => handleWizardCancel('Basic')}
                    showProgress={true}
                    allowSkipOptional={true}
                    showSummary={true}
                    className="h-full"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              The basic wizard demonstrates step navigation, form validation, progress tracking, and 
              the ability to skip optional steps. Use the step navigator to jump between completed steps.
            </AlertDescription>
          </Alert>
        </TabsContent>

        {/* Property Listing Tab */}
        <TabsContent value="property" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Home className="h-5 w-5" />
                    Property Listing Wizard
                  </CardTitle>
                  <CardDescription>
                    Complete property listing wizard for PropertyChain real estate platform
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  {completedWizards.has('property') ? (
                    <Badge variant="default">
                      <Check className="mr-1 h-3 w-3" />
                      Listing Created
                    </Badge>
                  ) : (
                    <Badge variant="outline">
                      In Progress
                    </Badge>
                  )}
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => resetWizard('property')}
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Start Over
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <PropertyListingWizard
                onComplete={handlePropertyListingComplete}
                onCancel={() => handleWizardCancel('Property Listing')}
                className="min-h-[600px]"
              />
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Property Listing Features</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <Home className="h-4 w-4 text-blue-500" />
                    <span>Comprehensive property details collection</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-green-500" />
                    <span>Location and neighborhood information</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Camera className="h-4 w-4 text-purple-500" />
                    <span>Photo and media upload management</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-orange-500" />
                    <span>Financial details and pricing</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-red-500" />
                    <span>Legal information and disclosures</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-teal-500" />
                    <span>Marketing and showing preferences</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Validation & Features</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Real-time form validation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4 text-blue-500" />
                    <span>Step-by-step progress tracking</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Save className="h-4 w-4 text-purple-500" />
                    <span>Auto-save draft functionality</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Upload className="h-4 w-4 text-orange-500" />
                    <span>Media upload with preview</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span>Feature and amenity selection</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clipboard className="h-4 w-4 text-gray-500" />
                    <span>Comprehensive review before submit</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Transaction Tab */}
        <TabsContent value="transaction" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Transaction Processing Wizard
                  </CardTitle>
                  <CardDescription>
                    Manage real estate transactions from offer to closing
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  {completedWizards.has('transaction') ? (
                    <Badge variant="default">
                      <Check className="mr-1 h-3 w-3" />
                      Transaction Setup
                    </Badge>
                  ) : (
                    <Badge variant="outline">
                      Setup Required
                    </Badge>
                  )}
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => resetWizard('transaction')}
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Reset
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <TransactionWizard
                onComplete={handleTransactionComplete}
                onCancel={() => handleWizardCancel('Transaction')}
                className="min-h-[600px]"
              />
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Transaction Steps</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-blue-500" />
                    <span>Parties Involved (Buyer, Seller, Agents)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Home className="h-4 w-4 text-green-500" />
                    <span>Property Information & Details</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-purple-500" />
                    <span>Financial Terms & Loan Details</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-orange-500" />
                    <span>Important Dates & Timeline</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-red-500" />
                    <span>Contingencies & Protections</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-teal-500" />
                    <span>Disclosures & Legal Documents</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Transaction Features</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-blue-500" />
                    <span>Deadline tracking and reminders</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Bell className="h-4 w-4 text-green-500" />
                    <span>Automatic notifications</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-purple-500" />
                    <span>Document generation and management</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-orange-500" />
                    <span>Multi-party collaboration</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-red-500" />
                    <span>Compliance and audit trail</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-teal-500" />
                    <span>Progress tracking and reporting</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Components Tab */}
        <TabsContent value="components" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                name: 'WizardForm',
                description: 'Main wizard container with progress tracking and navigation',
                features: ['Step management', 'Progress indicators', 'Navigation controls', 'Validation handling'],
                icon: <Navigation className="h-6 w-6 text-blue-500" />,
              },
              {
                name: 'StepNavigator',
                description: 'Visual step navigation with multiple display variants',
                features: ['Horizontal/vertical layout', 'Compact/detailed views', 'Click navigation', 'Status indicators'],
                icon: <Layers className="h-6 w-6 text-green-500" />,
              },
              {
                name: 'FormStep',
                description: 'Individual step wrapper with title and content area',
                features: ['Step content container', 'Title and description', 'Validation display', 'Custom styling'],
                icon: <Clipboard className="h-6 w-6 text-purple-500" />,
              },
              {
                name: 'useWizardForm',
                description: 'React hook for managing wizard state and navigation',
                features: ['State management', 'Step validation', 'Progress tracking', 'Navigation helpers'],
                icon: <Zap className="h-6 w-6 text-orange-500" />,
              },
              {
                name: 'PropertyListingWizard',
                description: 'Complete property listing creation wizard',
                features: ['9-step listing process', 'Media upload', 'Feature selection', 'Review and submit'],
                icon: <Home className="h-6 w-6 text-red-500" />,
              },
              {
                name: 'TransactionWizard',
                description: 'Real estate transaction processing wizard',
                features: ['Party management', 'Financial terms', 'Timeline setup', 'Legal compliance'],
                icon: <DollarSign className="h-6 w-6 text-teal-500" />,
              },
            ].map((component, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    {component.icon}
                    {component.name}
                  </CardTitle>
                  <CardDescription className="text-sm">
                    {component.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1">
                    {component.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="text-sm text-muted-foreground flex items-center gap-2">
                        <CheckCircle className="h-3 w-3 text-green-500" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Features Tab */}
        <TabsContent value="features" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Core Wizard Features</CardTitle>
                <CardDescription>
                  Essential wizard functionality and user experience features
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <ArrowRight className="h-4 w-4" />
                    <span>Multi-step form navigation</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Activity className="h-4 w-4" />
                    <span>Real-time progress tracking</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4" />
                    <span>Step validation and error handling</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Eye className="h-4 w-4" />
                    <span>Visual step indicators</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Save className="h-4 w-4" />
                    <span>Auto-save and draft management</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <ArrowLeft className="h-4 w-4" />
                    <span>Backward navigation to previous steps</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Star className="h-4 w-4" />
                    <span>Optional step skipping</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clipboard className="h-4 w-4" />
                    <span>Comprehensive review before submission</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>PropertyChain Specific</CardTitle>
                <CardDescription>
                  Real estate focused wizard features and integrations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Home className="h-4 w-4" />
                    <span>Property listing creation wizard</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <DollarSign className="h-4 w-4" />
                    <span>Transaction processing workflow</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Camera className="h-4 w-4" />
                    <span>Media upload and management</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4" />
                    <span>Location and neighborhood data</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Shield className="h-4 w-4" />
                    <span>Legal compliance and disclosures</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4" />
                    <span>Multi-party transaction management</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4" />
                    <span>Timeline and deadline tracking</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <FileText className="h-4 w-4" />
                    <span>Document generation and storage</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>User Experience</CardTitle>
                <CardDescription>
                  Usability and accessibility features
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Eye className="h-4 w-4" />
                    <span>Responsive design for all devices</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Key className="h-4 w-4" />
                    <span>Keyboard navigation support</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Info className="h-4 w-4" />
                    <span>Contextual help and tooltips</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <AlertCircle className="h-4 w-4" />
                    <span>Clear error messages and guidance</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <RefreshCw className="h-4 w-4" />
                    <span>Form reset and restart options</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4" />
                    <span>Auto-save to prevent data loss</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Heart className="h-4 w-4" />
                    <span>User-friendly interface design</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Award className="h-4 w-4" />
                    <span>WCAG accessibility compliance</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Technical Features</CardTitle>
                <CardDescription>
                  Development and integration capabilities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Zap className="h-4 w-4" />
                    <span>React Hook Form integration</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Shield className="h-4 w-4" />
                    <span>Zod schema validation</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <BookOpen className="h-4 w-4" />
                    <span>TypeScript support throughout</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Settings className="h-4 w-4" />
                    <span>Customizable step components</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Layers className="h-4 w-4" />
                    <span>Composable wizard architecture</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Target className="h-4 w-4" />
                    <span>Event-driven state management</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Globe className="h-4 w-4" />
                    <span>API integration ready</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <TrendingUp className="h-4 w-4" />
                    <span>Performance optimized rendering</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              The wizard system is built with flexibility and extensibility in mind, allowing for 
              easy customization of steps, validation rules, and UI components to match specific 
              business requirements and design systems.
            </AlertDescription>
          </Alert>
        </TabsContent>

        {/* Validation Tab */}
        <TabsContent value="validation" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Validation Features</CardTitle>
                <CardDescription>
                  Form validation and error handling capabilities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="font-medium text-sm">Real-time Validation</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Instant feedback as users type, with debounced validation to prevent excessive checking.
                    </p>
                  </div>

                  <div className="p-3 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle className="h-4 w-4 text-red-500" />
                      <span className="font-medium text-sm">Error Handling</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Clear error messages with specific guidance on how to fix validation issues.
                    </p>
                  </div>

                  <div className="p-3 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="h-4 w-4 text-blue-500" />
                      <span className="font-medium text-sm">Schema Validation</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Zod-based schema validation with TypeScript integration for type-safe forms.
                    </p>
                  </div>

                  <div className="p-3 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span className="font-medium text-sm">Conditional Validation</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Dynamic validation rules based on user selections and step dependencies.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Validation Examples</CardTitle>
                <CardDescription>
                  Common validation scenarios and patterns
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start gap-2 text-sm">
                    <div className="w-2 h-2 rounded-full bg-red-500 mt-2"></div>
                    <div>
                      <span className="font-medium">Required Fields:</span>
                      <span className="text-muted-foreground"> Name, email, property address</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 text-sm">
                    <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
                    <div>
                      <span className="font-medium">Format Validation:</span>
                      <span className="text-muted-foreground"> Email format, phone numbers, ZIP codes</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 text-sm">
                    <div className="w-2 h-2 rounded-full bg-green-500 mt-2"></div>
                    <div>
                      <span className="font-medium">Range Validation:</span>
                      <span className="text-muted-foreground"> Price ranges, square footage, year built</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 text-sm">
                    <div className="w-2 h-2 rounded-full bg-purple-500 mt-2"></div>
                    <div>
                      <span className="font-medium">Cross-field Validation:</span>
                      <span className="text-muted-foreground"> Loan amount vs. property value</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 text-sm">
                    <div className="w-2 h-2 rounded-full bg-orange-500 mt-2"></div>
                    <div>
                      <span className="font-medium">File Validation:</span>
                      <span className="text-muted-foreground"> Image formats, file sizes, document types</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 text-sm">
                    <div className="w-2 h-2 rounded-full bg-teal-500 mt-2"></div>
                    <div>
                      <span className="font-medium">Business Rules:</span>
                      <span className="text-muted-foreground"> Legal requirements, market constraints</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Validation Testing</CardTitle>
              <CardDescription>
                Test various validation scenarios
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <Button 
                  variant="outline" 
                  onClick={() => toastError('Email format is invalid')}
                  className="justify-start"
                >
                  <Mail className="mr-2 h-4 w-4" />
                  Test Email Validation
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={() => toastError('Price must be greater than $0')}
                  className="justify-start"
                >
                  <DollarSign className="mr-2 h-4 w-4" />
                  Test Price Validation
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={() => toastError('This field is required')}
                  className="justify-start"
                >
                  <AlertCircle className="mr-2 h-4 w-4" />
                  Test Required Field
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={() => toastError('File size must be less than 10MB')}
                  className="justify-start"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Test File Size
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={() => toastWarning('Some fields have warnings')}
                  className="justify-start"
                >
                  <AlertTriangle className="mr-2 h-4 w-4" />
                  Test Warning
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={() => toastSuccess('All validations passed!')}
                  className="justify-start"
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Test Success
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Features Summary */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Wizard Forms System</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <h3 className="font-semibold mb-2">Core Components</h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>✅ Multi-step wizard form with navigation</li>
                <li>✅ Progress indicators and step tracking</li>
                <li>✅ Form validation with error handling</li>
                <li>✅ Step navigator with multiple variants</li>
                <li>✅ Customizable step components</li>
                <li>✅ Auto-save and draft functionality</li>
                <li>✅ Responsive design for all devices</li>
                <li>✅ Keyboard navigation support</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">PropertyChain Features</h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>✅ Property listing creation wizard (9 steps)</li>
                <li>✅ Transaction processing wizard (7 steps)</li>
                <li>✅ Real estate specific validation rules</li>
                <li>✅ Media upload and management</li>
                <li>✅ Legal compliance and disclosures</li>
                <li>✅ Financial calculations and validations</li>
                <li>✅ Multi-party transaction support</li>
                <li>✅ Document generation integration</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Advanced Features</h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>✅ React Hook Form integration</li>
                <li>✅ Zod schema validation</li>
                <li>✅ TypeScript support throughout</li>
                <li>✅ Conditional step logic</li>
                <li>✅ Custom validation hooks</li>
                <li>✅ Step completion tracking</li>
                <li>✅ Progress persistence</li>
                <li>✅ WCAG accessibility compliance</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}